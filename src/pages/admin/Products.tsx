import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, createProduct, updateProduct, deleteProduct, type Product } from "../../lib/admin";
import { motion } from "framer-motion";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import { toast } from "sonner";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product created successfully!");
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product updated successfully!");
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product deleted!");
    },
  });

  const [form, setForm] = useState<Partial<Product>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setForm({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Please fill in required fields");
      return;
    }

    if (form.id) {
      updateMutation.mutate(form as Product);
    } else {
      createMutation.mutate(form as Product);
    }
  };

  const editProduct = (p: Product) => {
    setForm(p);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Products Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <motion.button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-forest transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" /> Add Product
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div className="p-4 bg-card border border-border rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs text-muted-foreground mb-1">Total Products</p>
          <p className="text-2xl font-bold text-primary">{products.length}</p>
        </motion.div>
        <motion.div className="p-4 bg-card border border-border rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-xs text-muted-foreground mb-1">Total Value</p>
          <p className="text-2xl font-bold text-green-600">₹{products.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(0)}</p>
        </motion.div>
        <motion.div className="p-4 bg-card border border-border rounded-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xs text-muted-foreground mb-1">Avg Price</p>
          <p className="text-2xl font-bold text-blue-600">₹{(products.reduce((sum, p) => sum + (p.price || 0), 0) / (products.length || 1)).toFixed(0)}</p>
        </motion.div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-card border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No products yet. Create your first product!</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-forest transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              {product.image && (
                <div className="mb-4 w-full h-32 rounded-lg overflow-hidden border border-border">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{product.description || "No description"}</p>
              </div>

              <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-xl font-bold text-primary">₹{product.price.toFixed(0)}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editProduct(product)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => {
                    deleteMutation.mutate(product.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {form.id ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., EcoClean Kitchen Degreaser"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  placeholder="e.g., 499"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the product..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Product Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={form.image || ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm({ ...form, image: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors flex items-center justify-center whitespace-nowrap text-sm font-medium"
                  >
                    Upload Image
                  </label>
                </div>
                {form.image && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-muted/30 rounded-lg border border-border">
                    <img src={form.image} alt="Preview" className="w-12 h-12 object-cover rounded-md border border-border" />
                    <span className="text-xs text-muted-foreground truncate flex-1">
                      {form.image.startsWith('data:') ? 'Local image selected' : 'Image URL linked'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="text-red-500 hover:text-red-600 p-1"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : form.id ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
