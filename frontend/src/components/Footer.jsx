import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Mail, Phone, MessageCircle, ShieldCheck, Send, CreditCard, Wallet, Building2
} from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [accepted, setAccepted] = useState(false);

    const handleSubscribe = () => {
        if (!name || !email) {
            toast.error("Preenche o nome e o email");
            return;
        }
        if (!accepted) {
            toast.error("Tens de aceitar os Termos e Condições");
            return;
        }
        toast.success("Inscrição realizada com sucesso!");
        setName("");
        setEmail("");
        setAccepted(false);
    };

    return (
        <footer className="bg-slate-900 text-slate-300 mt-10">
            {/* Newsletter Strip */}
            <div className="bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-3 text-white">
                        <Mail size={22} />
                        <p className="font-bold text-sm sm:text-base">
                            Inscreve-te e recebe novidades e ofertas exclusivas
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full sm:w-40 px-4 py-2.5 rounded-xl text-sm outline-none text-slate-800"
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full sm:w-56 px-4 py-2.5 rounded-xl text-sm outline-none text-slate-800"
                        />
                        <button
                            onClick={handleSubscribe}
                            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            <Send size={14} /> Inscrever
                        </button>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 pb-4 flex items-center gap-2 text-xs text-blue-100">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className="rounded"
                    />
                    <span>
                        Ao clicar, aceito os{" "}
                        <Link to="/termos" className="underline font-semibold hover:text-white">
                            Termos e Condições
                        </Link>
                    </span>
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                {/* Logo + Security */}
                <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                    <span className="text-2xl font-black text-white tracking-tight">OSOTEC</span>
                    <p className="text-sm text-slate-400 mt-3 mb-5">
                        Tecnologia de confiança ao teu alcance, em todo o território angolano.
                    </p>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Site Seguro</p>
                    <div className="flex gap-3">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-emerald-400" />
                            <span className="text-xs font-bold text-white">SSL Seguro</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-blue-400" />
                            <span className="text-xs font-bold text-white">ISO 9001</span>
                        </div>
                    </div>
                </div>

                {/* Dúvidas */}
                <div>
                    <h3 className="font-bold text-white mb-4">Dúvidas</h3>
                    <ul className="space-y-2.5 text-sm">
                        {[
                            { label: "Assistência Técnica", to: "/suporte" },
                            { label: "Rastrear Encomenda", to: "/rastreamento" },
                            { label: "Perguntas Frequentes", to: "/faq" },
                            { label: "Fala Connosco", to: "/suporte" },
                            { label: "Política de Troca", to: "/trocas" },
                        ].map((l) => (
                            <li key={l.label}>
                                <Link to={l.to} className="text-slate-400 hover:text-blue-400 transition-colors">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Institucional */}
                <div>
                    <h3 className="font-bold text-white mb-4">Institucional</h3>
                    <ul className="space-y-2.5 text-sm">
                        {[
                            { label: "Quem Somos", to: "/sobre" },
                            { label: "Termos e Condições", to: "/termos" },
                            { label: "Política de Privacidade", to: "/privacidade" },
                            { label: "Política de Cookies", to: "/cookies" },
                        ].map((l) => (
                            <li key={l.label}>
                                <Link to={l.to} className="text-slate-400 hover:text-blue-400 transition-colors">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Suporte */}
                <div>
                    <h3 className="font-bold text-white mb-4">Suporte</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li className="flex items-center gap-2">
                            <Building2 size={15} className="text-blue-400 flex-shrink-0" />
                            Segunda a Sexta, 8h às 17h
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={15} className="text-blue-400 flex-shrink-0" />
                            <a href="tel:+244941089947" className="hover:text-white">+244 941 089 947</a>
                        </li>
                        <li className="flex items-center gap-2">
                            <MessageCircle size={15} className="text-blue-400 flex-shrink-0" />
                            <a href="https://wa.me/244923000000" target="_blank" rel="noreferrer" className="hover:text-white">
                                +244 941 715 504 (WhatsApp)
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail size={15} className="text-blue-400 flex-shrink-0" />
                            <a href="mailto:suporte@osotec.ao" className="hover:text-white">suporte@osotec.ao</a>
                        </li>
                    </ul>
                </div>

                {/* Pagamento + Social */}
                <div>
                    <h3 className="font-bold text-white mb-4">Formas de Pagamento</h3>
                    <div className="space-y-2 mb-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2.5">
                            <CreditCard size={16} className="text-blue-400" />
                            <span className="text-xs font-semibold text-slate-300">Multicaixa / TPA</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2.5">
                            <Wallet size={16} className="text-emerald-400" />
                            <span className="text-xs font-semibold text-slate-300">Transferência Bancária</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2.5">
                            <Building2 size={16} className="text-orange-400" />
                            <span className="text-xs font-semibold text-slate-300">Pagamento na Entrega</span>
                        </div>
                    </div>

                    <h3 className="font-bold text-white mb-3">Redes Sociais</h3>
                    <div className="flex gap-3">
                        {[
                            { icon: FaFacebook, href: "#" },
                            { icon: FaInstagram, href: "#" },
                            { icon: FaYoutube, href: "#" },
                            { icon: FaLinkedin, href: "#" },
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <a
                                    key={i}
                                    href={s.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-colors"
                                >
                                    <Icon size={16} className="text-white" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-950 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} OSOTEC. Todos os direitos reservados.
                    </p>
                    <p className="text-xs text-slate-600">Comércio Electrónico · Angola</p>
                </div>
            </div>
        </footer>
    );
}