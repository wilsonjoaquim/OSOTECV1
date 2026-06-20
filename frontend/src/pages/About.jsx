import AnnaViegas from "../assets/Anna Viegas.jpeg";
import EufrazinoGunza from "../assets/Eufrazino Gunza.jpg";
import IgorVenda from "../assets/Igor Venda.jpeg";
import WilsonJoaquim from "../assets/Wilson Joaquim.jpeg";
import CelsoNgunza from "../assets/Celso Ngunza.jpeg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, Truck, HeadphonesIcon, Target, Award, Users, ArrowRight, X } from "lucide-react";

const TEAM = [
    { name: "Anna Viegas", studentId: "Nº 229500", role: "Analista de Requisitos", photo: AnnaViegas },
    { name: "Eufrazino Gunza", studentId: "Nº 203323", role: "Desenvolvedor Frontend", photo: EufrazinoGunza, modalPosition: "object-[center_5%]" },
    { name: "Igor Venda", studentId: "Nº 223718", role: "Analista de Dados", photo: IgorVenda },
    { name: "Wilson Joaquim", studentId: "Nº 227712", role: "Desenvolvedor Backend", photo: WilsonJoaquim, modalPosition: "object-[center_5%]" },
    { name: "Celso Ngunza", studentId: "Nº 223718", role: "Designer de UX/UI", photo: CelsoNgunza },
];

export default function About() {

    const navigate = useNavigate();
    const [selectedMember, setSelectedMember] = useState(null);

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50">
            <div className="max-w-5xl mx-auto px-4">
                {/* Hero */}
                <div className="text-center mb-14">
                    <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">Sobre Nós</p>
                    <h1 className="text-4xl font-black text-slate-800 mb-4">Quem Somos</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        A OSOTEC nasceu com o propósito de aproximar a tecnologia de confiança de cada angolano, em qualquer ponto do país.
                    </p>
                </div>

                {/* Mission */}
                <div className="grid sm:grid-cols-3 gap-5 mb-16">
                    {[
                        { icon: Target, title: "Missão", desc: "Tornar a tecnologia acessível, segura e rápida para todos os angolanos." },
                        { icon: Award, title: "Visão", desc: "Ser a maior referência de comércio electrónico de tecnologia em Angola." },
                        { icon: Users, title: "Valores", desc: "Transparência, rapidez na entrega e suporte humano sempre disponível." },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                    <Icon size={22} className="text-blue-600" />
                                </div>
                                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Story */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10 mb-14">
                    <h2 className="text-2xl font-black text-slate-800 mb-4">A Nossa História</h2>
                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>
                            A OSOTEC surgiu da necessidade de oferecer um comércio electrónico verdadeiramente angolano: rápido, seguro e adaptado às realidades do mercado local, desde os métodos de pagamento até à logística de entrega.
                        </p>
                        <p>
                            Começámos com um catálogo focado em computadores e smartphones, e fomos expandindo para acessórios, componentes, câmeras e soluções de energia, sempre com o mesmo compromisso: produtos de qualidade, preços justos e atendimento próximo.
                        </p>
                        <p>
                            Hoje, contamos com uma equipa dedicada de suporte técnico, um sistema de rastreamento de encomendas em tempo real, e estamos a expandir progressivamente a nossa cobertura para todas as províncias do país.
                        </p>
                    </div>
                </div>

                {/* Team */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">Bastidores</p>
                        <h2 className="text-2xl font-black text-slate-800">A Nossa Equipa</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                        {TEAM.map((member, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedMember(member)}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group"
                            >
                                <div className="relative h-52 bg-slate-100 overflow-hidden">
                                    <img
                                        src={member.photo}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent" />
                                </div>
                                <div className="p-4">
                                    <p className="font-bold text-slate-800 text-sm leading-tight">{member.name}</p>
                                    <p className="text-xs text-blue-600 font-semibold mt-1">{member.role}</p>
                                    <p className="text-xs text-slate-400 mt-1">{member.studentId}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coverage */}
                <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-3xl p-8 sm:p-10 mb-14 text-center">
                    <p className="text-blue-100 font-bold text-sm uppercase tracking-wider mb-2">Cobertura</p>
                    <h2 className="text-2xl font-black text-white mb-3">
                        Presentes em várias províncias angolanas
                    </h2>
                    <p className="text-blue-100 text-sm max-w-xl mx-auto">
                        Entregamos actualmente em Luanda, Benguela, Huambo, Huíla, Namibe e Cabinda, com planos contínuos de expansão nacional.
                    </p>
                </div>

                {/* Trust */}
                <div className="grid sm:grid-cols-3 gap-5 mb-14">
                    {[
                        { icon: Shield, title: "Compra Segura", desc: "Pagamentos protegidos em todas as transacções" },
                        { icon: Truck, title: "Entrega Rastreada", desc: "Acompanha o teu pedido em tempo real" },
                        { icon: HeadphonesIcon, title: "Suporte Dedicado", desc: "Equipa técnica sempre pronta a ajudar" },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} className="flex items-start gap-3 bg-blue-50 rounded-2xl p-5 border border-blue-100">
                                <Icon size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <button
                        onClick={() => navigate("/produtos")}
                        className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 inline-flex items-center gap-2"
                    >
                        Explorar Produtos <ArrowRight size={18} />
                    </button>
                </div>
            </div>
            {/* Modal Foto Equipa */}
            {selectedMember && (
                <div
                    onClick={() => setSelectedMember(null)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full"
                    >
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                        >
                            <X size={18} className="text-white" />
                        </button>

                        <div className="w-full h-96 bg-slate-100">
                            <img
                                src={selectedMember.photo}
                                alt={selectedMember.name}
                                className={`w-full h-full object-cover ${selectedMember.modalPosition || "object-top"}`}
                            />
                        </div>

                        <div className="p-6">
                            <p className="font-black text-slate-800 text-xl">{selectedMember.name}</p>
                            <p className="text-blue-600 font-bold text-sm mt-1">{selectedMember.role}</p>
                            <p className="text-slate-400 text-sm mt-1">{selectedMember.studentId}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}