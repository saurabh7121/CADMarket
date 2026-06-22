import { useState } from 'react';
import api from '../lib/api';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch {
      toast.error('Failed to send message. Try emailing us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container-narrow px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-[#e5e5e5] mb-3">Get in Touch</h1>
          <p className="text-[#a3a3a3] max-w-md mx-auto text-sm sm:text-base">
            Have questions about our CAD designs? Need custom files? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-4">
            {[
              { icon: Mail, label: 'Email', value: 'support@cadmarket.com', href: 'mailto:support@cadmarket.com' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { icon: MapPin, label: 'Location', value: 'Mumbai, Maharashtra, India' },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="glass-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-white/5 border border-[#404040] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#e5e5e5]" />
                </div>
                <div>
                  <p className="text-xs text-[#a3a3a3] mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-[#e5e5e5] hover:text-white transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm text-[#e5e5e5]">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm text-[#e5e5e5] mb-2">Business Hours</h3>
              <div className="space-y-1 text-sm text-[#a3a3a3]">
                <div className="flex justify-between"><span>Monday – Friday</span><span>9:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>10:00 AM – 4:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {sent ? (
              <div className="glass-card p-10 text-center">
                <CheckCircle className="text-white mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-[#e5e5e5] mb-2">Message Sent!</h3>
                <p className="text-[#a3a3a3] mb-5">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-primary">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#a3a3a3] mb-1.5">Name *</label>
                    <input
                      required value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#a3a3a3] mb-1.5">Email *</label>
                    <input
                      required type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a3a3a3] mb-1.5">Subject *</label>
                  <input
                    required value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="How can we help?"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a3a3a3] mb-1.5">Message *</label>
                  <textarea
                    required rows={5} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Describe your inquiry in detail…"
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3">
                  {loading ? <><span className="spinner w-4 h-4" /> Sending…</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
