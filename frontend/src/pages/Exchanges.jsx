import { RefreshCw, Clock, CheckCircle2, XCircle, Package, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Exchanges() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
            <RefreshCw size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Política de Troca</h1>
            <p className="text-sm text-slate-400">Última actualização: Junho de 2026</p>
          </div>
        </div>

        {/* Resumo rápido */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Clock, title: "7 Dias", desc: "Prazo para solicitar troca após receberes a encomenda" },
            { icon: Package, title: "Embalagem Original", desc: "Produto deve estar nas condições em que foi entregue" },
            { icon: MessageSquare, title: "Via Ticket", desc: "Pedido feito através do nosso sistema de suporte" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">1. Prazo para Solicitar Troca</h2>
            <p>
              Tens até 7 dias corridos após a entrega da encomenda para solicitar a troca ou devolução de um produto. Após este período, não é possível processar o pedido, salvo em casos de defeito de fabrico coberto por garantia.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">2. Como Solicitar uma Troca</h2>
            <p className="mb-3">
              O processo é feito integralmente através da nossa plataforma digital, sem necessidade de te deslocares a uma loja física:
            </p>
            <ol className="space-y-2 ml-1">
              {[
                "Acede à secção de Suporte e abre um novo ticket",
                "Selecciona a categoria \"Produto com defeito\" ou \"Cancelamento\"",
                "Indica o número da encomenda e descreve o motivo da troca",
                "A nossa equipa técnica analisa o pedido e responde em poucas horas",
                "Após aprovação, combinamos a recolha do produto e o envio do substituto",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">3. Condições para Aceitação</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <p className="font-bold text-emerald-700 text-sm">Aceitamos quando</p>
                </div>
                <ul className="text-sm text-emerald-700 space-y-1.5">
                  <li>• Produto com defeito de fabrico</li>
                  <li>• Item diferente do encomendado</li>
                  <li>• Produto danificado no transporte</li>
                  <li>• Embalagem original e acessórios completos</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={16} className="text-red-600" />
                  <p className="font-bold text-red-700 text-sm">Não aceitamos quando</p>
                </div>
                <ul className="text-sm text-red-700 space-y-1.5">
                  <li>• Mau uso ou dano causado pelo cliente</li>
                  <li>• Produto sem embalagem ou acessórios</li>
                  <li>• Prazo de 7 dias já expirado</li>
                  <li>• Simples mudança de opinião sem defeito</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">4. Reembolsos</h2>
            <p>
              Caso a troca não seja possível por falta de stock do mesmo produto, o reembolso é processado pelo mesmo método de pagamento utilizado na compra, num prazo de 5 a 10 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">5. Custos de Envio</h2>
            <p>
              Quando a troca resulta de erro nosso (produto errado, defeituoso ou danificado), os custos de recolha e novo envio são integralmente suportados pela OSOTEC. Em casos de desistência sem defeito, o custo de transporte fica a cargo do cliente.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/suporte")}
            className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 inline-flex items-center gap-2"
          >
            <MessageSquare size={18} /> Abrir Ticket de Troca
          </button>
        </div>
      </div>
    </div>
  );
}