import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { EmptyState } from '../../components/UI';
import { Plus, Edit2, Trash2, Search, Upload, Package, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Mechanical', 'Architecture', 'Electronics', 'Automotive', 'Aerospace', 'Medical', 'Industrial'];
const FILE_FORMATS = ['STEP', 'STL', 'SolidWorks', 'AutoCAD', 'IGES', 'OBJ', 'FBX', 'DXF'];
const FALLBACK = 'https://placehold.co/80x60/12121a/6c63ff?text=CAD';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/products?limit=100${search ? `&search=${search}` : ''}`);
      setProducts(r.data.products || []);
    } catch { setProducts([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleEdit = (product) => { setEditing(product); setModalOpen(true); };
  const handleNew = () => { setEditing(null); setModalOpen(true); };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/products/${deleteTarget}`);
      toast.success('Product deleted');
      setDeleteTarget(null);
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#e8e8f0]">Products</h1>
          <p className="text-sm text-[#8888aa]">{products.length} designs in catalog</p>
        </div>
        <button onClick={handleNew} className="btn-primary text-sm">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="input-field pl-9 text-sm py-2"
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a3e]">
                {['Product', 'Category', 'Price', 'Downloads', 'Formats', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs text-[#8888aa] font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-[#8888aa]">Loading…</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="py-12">
                  <EmptyState icon={Package} title="No products found" />
                </td></tr>
              ) : (
                products.map(p => (
                  <tr key={p._id} className="border-b border-[#1a1a28] hover:bg-white/2 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail || FALLBACK}
                          alt={p.title}
                          onError={e => { e.target.src = FALLBACK; }}
                          className="w-12 h-9 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <p className="font-medium text-[#e8e8f0] line-clamp-1">{p.title}</p>
                          <p className="text-xs text-[#8888aa] line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className="badge badge-primary">{p.category}</span></td>
                    <td className="py-3 px-4 font-bold text-[#e8e8f0]">₹{(p.price || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-[#8888aa]">{p.downloads || 0}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.fileFormats?.slice(0, 3).map(f => (
                          <span key={f} className="text-[9px] font-bold px-1.5 py-0.5 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg text-[#8888aa] hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p._id)}
                          className="p-1.5 rounded-lg text-[#8888aa] hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {modalOpen && (
        <ProductModal
          product={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSaved={() => { setModalOpen(false); setEditing(null); fetchProducts(); }}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="glass-card p-6 w-full max-w-sm text-center">
            <Trash2 size={32} className="text-[#ff6b6b] mx-auto mb-3" />
            <h3 className="font-bold text-[#e8e8f0] mb-2">Delete Product?</h3>
            <p className="text-sm text-[#8888aa] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 btn-ghost text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-[#ff6b6b]/20 border border-[#ff6b6b]/30 text-[#ff6b6b] rounded-xl py-2 text-sm font-medium hover:bg-[#ff6b6b]/30 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductModal({ product, onClose, onSaved }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: product?.title || '',
    description: product?.description || '',
    category: product?.category || CATEGORIES[0],
    price: product?.price || '',
    fileFormats: product?.fileFormats || [],
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [cadZip, setCadZip] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleFormat = (f) => {
    setForm(prev => ({
      ...prev,
      fileFormats: prev.fileFormats.includes(f)
        ? prev.fileFormats.filter(x => x !== f)
        : [...prev.fileFormats, f],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product && !thumbnail) { toast.error('Thumbnail is required'); return; }
    if (!product && !cadZip) { toast.error('CAD ZIP file is required'); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'fileFormats') fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (thumbnail) fd.append('thumbnail', thumbnail);
      previewFiles.forEach(f => fd.append('previewImages', f));
      if (cadZip) fd.append('cadFile', cadZip);

      if (product) {
        await api.put(`/admin/products/${product._id}`, fd);
        toast.success('Product updated!');
      } else {
        await api.post('/admin/products', fd);
        toast.success('Product created!');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a3e]">
          <h2 className="font-bold text-lg text-[#e8e8f0]">
            {product ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#8888aa] hover:text-[#e8e8f0] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#8888aa] mb-1.5">Title *</label>
            <input
              required value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="input-field" placeholder="e.g. Industrial Gear Assembly STEP"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#8888aa] mb-1.5">Description *</label>
            <textarea
              required rows={3} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input-field resize-none" placeholder="Describe the CAD design…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="input-field"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1.5">Price (₹) *</label>
              <input
                required type="number" min={0} step={1} value={form.price}
                onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
                className="input-field" placeholder="999"
              />
            </div>
          </div>

          {/* File formats */}
          <div>
            <label className="block text-xs font-semibold text-[#8888aa] mb-2">File Formats</label>
            <div className="flex flex-wrap gap-2">
              {FILE_FORMATS.map(f => (
                <button
                  key={f} type="button" onClick={() => toggleFormat(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    form.fileFormats.includes(f)
                      ? 'bg-[#00d4ff]/15 border-[#00d4ff]/40 text-[#00d4ff]'
                      : 'bg-transparent border-[#2a2a3e] text-[#8888aa] hover:border-[#00d4ff]/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-xs font-semibold text-[#8888aa] mb-1.5">
              Thumbnail Image {!product && <span className="text-[#ff6b6b]">*</span>}
            </label>
            <FileDropZone
              accept="image/*"
              label="Drop thumbnail or click to browse"
              file={thumbnail}
              onChange={setThumbnail}
              preview={product?.thumbnail}
            />
          </div>

          {/* Preview images */}
          <div>
            <label className="block text-xs font-semibold text-[#8888aa] mb-1.5">Preview Images (up to 5)</label>
            <input
              type="file" accept="image/*" multiple
              onChange={e => setPreviewFiles(Array.from(e.target.files).slice(0, 5))}
              className="input-field text-xs"
            />
            {previewFiles.length > 0 && (
              <p className="text-xs text-[#8888aa] mt-1">{previewFiles.length} file(s) selected</p>
            )}
          </div>

          {/* CAD ZIP */}
          <div>
            <label className="block text-xs font-semibold text-[#8888aa] mb-1.5">
              CAD ZIP File {!product && <span className="text-[#ff6b6b]">*</span>}
            </label>
            <FileDropZone
              accept=".zip,.rar,.7z"
              label="Drop CAD ZIP or click to browse"
              file={cadZip}
              onChange={setCadZip}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-ghost text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary text-sm">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileDropZone({ accept, label, file, onChange, preview }) {
  const ref = useRef(null);
  const previewUrl = file ? URL.createObjectURL(file) : preview;

  return (
    <div
      onClick={() => ref.current?.click()}
      className="border-2 border-dashed border-[#2a2a3e] rounded-xl p-5 text-center cursor-pointer hover:border-[#6c63ff]/40 transition-colors"
    >
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => onChange(e.target.files[0])} />
      {previewUrl && accept?.includes('image') ? (
        <img src={previewUrl} alt="" className="h-20 mx-auto object-contain rounded-lg mb-2" />
      ) : (
        <Upload size={20} className="text-[#8888aa] mx-auto mb-2" />
      )}
      <p className="text-xs text-[#8888aa]">
        {file ? file.name : label}
      </p>
    </div>
  );
}
