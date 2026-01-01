import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import ProductTable from '../../components/products/ProductTable';
import ProductModal from '../../components/products/ProductModal';
import { useProducts } from '../../hooks/useProducts';
import { Search, Plus } from 'lucide-react';
import { Product } from '../../types/product';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ProductsPage() {
    const { products, loading, refetch } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="space-y-6">

                {/* Header Toolbar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">จัดการสินค้า</h1>
                        <p className="text-slate-500 text-sm">Product Management System</p>
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleCreate}
                        className="shadow-lg shadow-primary-200"
                    >
                        <Plus size={20} className="mr-2" />
                        เพิ่มสินค้าใหม่
                    </Button>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="ค้นหารหัสสินค้า, ชื่อ, หรือหมวดหมู่..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                    {/* Can add more filters here later */}
                </div>

                {/* Product Table */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <ProductTable
                            products={filteredProducts}
                            onEdit={handleEdit}
                        />
                    )}
                </div>

                {/* Modal */}
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedProduct}
                    onSuccess={refetch}
                />

            </div>
        </MainLayout>
    );
}
