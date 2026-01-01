/**
 * Universal Address Parser - Version 4.0 (168sys)
 * Enhanced to handle Line ID, Social Media, and strict Thai address splitting.
 */

interface AddressTokens {
    taxid: string;
    zipcode: string;
    phone: string;
    email: string;
    maps: string;
    branch: string;
    line: string;
}

interface AddressComponents {
    province: string;
    district: string;
    subdistrict: string;
    road: string;
    lane: string;
    villageno: string;
    number: string;
    village: string;
}

export interface ParsedAddress extends AddressTokens, AddressComponents {
    name: string;
}

function extractGlobalTokens(text: string): { tokens: AddressTokens; cleanedText: string } {
    const tokens: AddressTokens = {
        taxid: '',
        zipcode: '',
        phone: '',
        email: '',
        maps: '',
        branch: '',
        line: ''
    };

    let cleanedText = text;

    // 1. Tax ID (13 digits)
    const taxidMatch = cleanedText.match(/(\d{13})/);
    if (taxidMatch) {
        tokens.taxid = taxidMatch[1];
        cleanedText = cleanedText.replace(taxidMatch[0], ' ');
    }

    // 2. Phone (Thai numbers)
    const phoneMatch = cleanedText.match(/(โทร\.?|Tel\.?|Phone\.?)?\s*(0[2-9]\d{0,1}[-\s]?\d{3}[-\s]?\d{3,4})/i);
    if (phoneMatch) {
        tokens.phone = phoneMatch[2].replace(/[-\s]/g, '');
        cleanedText = cleanedText.replace(phoneMatch[0], ' ');
    }

    // 3. Email
    const emailMatch = cleanedText.match(/(อีเมล\.?|Email\.?)?\s*([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
    if (emailMatch) {
        tokens.email = emailMatch[2];
        cleanedText = cleanedText.replace(emailMatch[0], ' ');
    }

    // 4. Maps
    const mapsMatch = cleanedText.match(/(https?:\/\/(?:www\.)?(?:google\.com\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)[^\s]+)/i);
    if (mapsMatch) {
        tokens.maps = mapsMatch[0];
        cleanedText = cleanedText.replace(mapsMatch[0], ' ');
    }

    // 5. Line ID
    const lineMatch = cleanedText.match(/(Line(?:\s*ID)?|ไลน์|ไอดี|id)\s*[:\-@]?\s*([a-zA-Z0-9._-]+)/i);
    if (lineMatch) {
        // Skip if it matched common labels like "id" for UUID or "Tel: id"
        if (!['id', 'ไลน์'].includes(lineMatch[2].toLowerCase())) {
            tokens.line = lineMatch[2];
            cleanedText = cleanedText.replace(lineMatch[0], ' ');
        }
    }

    // 6. Branch (Head Office / สาขา)
    if (cleanedText.match(/(\(?สำนักงานใหญ่\)?|Head Office)/i)) {
        tokens.branch = 'สำนักงานใหญ่';
        cleanedText = cleanedText.replace(/(\(?สำนักงานใหญ่\)?|Head Office)/gi, ' ');
    } else {
        const branchMatch = cleanedText.match(/(สาขา|Branch)[\s:]*(\d+|[a-zA-Z0-9]+)/i);
        if (branchMatch) {
            tokens.branch = branchMatch[2];
            cleanedText = cleanedText.replace(branchMatch[0], ' ');
        }
    }

    // 7. Zipcode (5 digits, > 10000)
    const zipcodeMatches = cleanedText.match(/(?<!\d)(\d{5})(?!\d)/g);
    if (zipcodeMatches) {
        const realZipcode = zipcodeMatches.find(z => parseInt(z) > 10000) || zipcodeMatches[zipcodeMatches.length - 1];
        tokens.zipcode = realZipcode;
        cleanedText = cleanedText.replace(realZipcode, ' ');
    }

    cleanedText = cleanedText.replace(/\s+/g, ' ').trim();

    return { tokens, cleanedText };
}

function extractAddressComponents(addressText: string): AddressComponents {
    const components: AddressComponents = {
        province: '',
        district: '',
        subdistrict: '',
        road: '',
        lane: '',
        villageno: '',
        number: '',
        village: ''
    };

    let working = addressText.trim();

    const extract = (regex: RegExp, field: keyof AddressComponents): boolean => {
        const match = working.match(regex);
        if (match) {
            components[field] = (match[2] || match[1]).trim();
            working = working.replace(match[0], ' ').replace(/\s+/g, ' ').trim();
            return true;
        }
        return false;
    };

    // Province
    if (!extract(/(จังหวัด|จ\.|Province)\s*([^\s]+)/i, 'province')) {
        const bkkMatch = working.match(/(กรุงเทพมหานคร|กรุงเทพฯ|กรุงเทพ|Bangkok)/i);
        if (bkkMatch) {
            components.province = 'กรุงเทพมหานคร';
            working = working.replace(bkkMatch[0], ' ');
        }
    }

    // District
    extract(/(อำเภอ|อ\.|เขต|District|Amphoe)\s*([^\s]+)/i, 'district');

    // Subdistrict
    extract(/(ตำบล|ต\.|แขวง|Tambon|Subdistrict)\s*([^\s]+)/i, 'subdistrict');

    // Road
    extract(/(ถนน|ถ\.|Road|Rd\.)\s*([^\s]+)/i, 'road');

    // Soi
    extract(/(ซอย|ซ\.|Soi|S\.)\s*([^\s]+(?:\s+\d+)?)/i, 'lane');

    // Moo
    extract(/(หมู่|ม\.|Moo|M\.)\s*(\d+)/i, 'villageno');

    // House Number
    const houseNumMatch = working.match(/((?:เลขที่|No\.?)?\s*\d+(?:\/\d+)?)/i);
    if (houseNumMatch) {
        components.number = houseNumMatch[1].replace(/^(เลขที่|No\.?)\s*/i, '').trim();
        working = working.replace(houseNumMatch[0], ' ');
    }

    // Building / Village (Remainder)
    working = working.trim();
    if (working && working.length > 2 && !working.match(/^[\d\s,.-]+$/)) {
        working = working.replace(/^(อาคาร|หมู่บ้าน|Building)\s*/i, '');
        components.village = working.trim();
    }

    return components;
}

function findSplitPoint(text: string): number {
    const limitWords = ['บริษัท', 'หจก', 'จำกัด', 'Co.,Ltd', 'Ltd'];
    const thaiLimitMatch = text.match(/(?:บริษัท|หจก\.).+?(?:จำกัด)/i);
    if (thaiLimitMatch) return (thaiLimitMatch.index || 0) + thaiLimitMatch[0].length;

    const engLimitMatch = text.match(/.+?(?:Co\.,?\s*Ltd|Limited)/i);
    if (engLimitMatch) return (engLimitMatch.index || 0) + engLimitMatch[0].length;

    // Fallback split before address elements
    const addressTrigger = text.match(/(?:เลขที่|No\.|\d+\/\d+)/i);
    if (addressTrigger) return addressTrigger.index || 0;

    return text.length;
}

export function parseUniversalAddress(inputText: string): ParsedAddress {
    let text = inputText
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const { tokens, cleanedText } = extractGlobalTokens(text);

    const splitIndex = findSplitPoint(cleanedText);
    const companyPart = cleanedText.substring(0, splitIndex).trim();
    const addressPart = cleanedText.substring(splitIndex).trim();

    const addressComponents = extractAddressComponents(addressPart);

    // Identify Name: If companyPart is too short, maybe use tokens.phone label or first line
    let primaryName = companyPart || '';
    if (!primaryName && text) {
        const firstLine = text.split('\n')[0].replace(/^(ชื่อ|Name|:)+/i, '').trim();
        primaryName = firstLine.substring(0, 50); // Sanity limit
    }

    return {
        name: primaryName,
        phone: tokens.phone,
        email: tokens.email,
        line: tokens.line,
        taxid: tokens.taxid,
        branch: tokens.branch,
        maps: tokens.maps,
        number: addressComponents.number,
        villageno: addressComponents.villageno,
        village: addressComponents.village,
        lane: addressComponents.lane,
        road: addressComponents.road,
        subdistrict: addressComponents.subdistrict,
        district: addressComponents.district,
        province: addressComponents.province,
        zipcode: tokens.zipcode
    };
}
