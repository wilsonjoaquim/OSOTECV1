import { useState } from "react";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQ_CATEGORIES = [
  {
    title: "Compras e Pagamento",
    items: [
      {
        q: "Preciso de criar uma conta para comprar?",
        a: "Não. Na OSOTEC podes comprar directamente, sem necessidade de registo. Basta adicionares os produtos ao carrinho e preencheres os teus dados no checkout.",
      },
      {
        q: "Quais são as formas de pagamento disponíveis?",
        a: "Aceitamos Cartão Multicaixa/TPA, Transferência Bancária e Pagamento na Entrega. Podes escolher a opção que preferires directamente na página de finalização de compra.",
      },
      {
        q: "Os meus dados de cartão ficam guardados?",
        a: "Não armazenamos os dados completos do teu cartão nos nossos servidores. O processamento é feito de forma segura no momento da transacção.",
      },
      {
        q: "Posso alterar a quantidade de um produto depois de o adicionar ao carrinho?",
        a: "Sim. Tanto na página de produtos como no checkout podes ajustar a quantidade de cada item usando os botões de mais e menos, ou removê-lo completamente.",
      },
    ],
  },
  {
    title: "Entrega e Rastreamento",
    items: [
      {
        q: "Quanto tempo demora a entrega?",
        a: "O prazo varia de acordo com a província de destino. Em Luanda, o prazo médio é de 24 a 48 horas. Para outras províncias, o tempo pode ser superior dependendo da localização.",
      },
      {
        q: "Como posso acompanhar a minha encomenda?",
        a: "Após a confirmação da compra, recebes um número de encomenda. Podes usá-lo na secção de Rastreamento para ver em tempo real em que fase está a tua entrega.",
      },
      {
        q: "Entregam em todas as províncias de Angola?",
        a: "Actualmente entregamos em Luanda, Benguela, Huambo, Huíla, Namibe e Cabinda, com expansão contínua para as restantes províncias.",
      },
      {
        q: "O que faço se a minha encomenda não chegar no prazo esperado?",
        a: "Podes abrir um ticket na secção de Suporte, seleccionando a categoria \"Entrega / Rastreamento\", indicando o número da tua encomenda para que a nossa equipa investigue o atraso.",
      },
    ],
  },
  {
    title: "Produtos e Garantia",
    items: [
      {
        q: "Os produtos são novos ou recondicionados?",
        a: "Vendemos ambos. Cada produto está claramente identificado como \"Novo\" ou \"Recondicionado\" na sua página, para que possas escolher com total transparência.",
      },
      {
        q: "Os produtos têm garantia?",
        a: "Sim, todos os produtos novos têm garantia do fabricante. Produtos recondicionados têm garantia OSOTEC, cujo período é indicado na descrição de cada artigo.",
      },
      {
        q: "Recebi um produto com defeito, o que faço?",
        a: "Abre um ticket de suporte na categoria \"Produto com defeito\" dentro de 7 dias após a entrega. Consulta a nossa Política de Troca para mais detalhes sobre o processo.",
      },
    ],
  },
  {
    title: "Suporte e Contacto",
    items: [
      {
        q: "Como posso contactar a equipa de suporte?",
        a: "Podes abrir um ticket directamente na secção de Suporte, enviar email para suporte@osotec.ao, ou contactar-nos via WhatsApp pelo número disponível no rodapé do site.",
      },
      {
        q: "Quanto tempo demora a resposta de um ticket?",
        a: "A nossa equipa técnica responde, em média, em menos de 2 horas durante o horário de funcionamento (Segunda a Sexta, das 8h às 17h).",
      },
      {
        q: "Como sei se o meu ticket já foi resolvido?",
        a: "Na secção de Suporte, usa a opção \"Acompanhar Ticket\" e insere o número que recebeste ao criares o pedido. Vais ver o histórico completo e o estado actual.",
      },
    ],
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
      >
        <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-blue-600" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-4" : "max-h-0"}`}
      >
        <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
            <HelpCircle size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Perguntas Frequentes</h1>
            <p className="text-sm text-slate-400">Tudo o que precisas de saber sobre a OSOTEC</p>
          </div>
        </div>

        <div className="space-y-8">
          {FAQ_CATEGORIES.map((cat, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
              <h2 className="font-black text-blue-600 text-sm uppercase tracking-wider mb-2">
                {cat.title}
              </h2>
              <div>
                {cat.items.map((item, j) => (
                  <FaqItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 bg-slate-900 rounded-3xl p-8">
          <p className="text-white font-bold text-lg mb-1">Não encontraste a tua resposta?</p>
          <p className="text-slate-400 text-sm mb-5">A nossa equipa está pronta a ajudar-te directamente.</p>
          <button
            onClick={() => navigate("/suporte")}
            className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
          >
            <MessageSquare size={18} /> Abrir Ticket de Suporte
          </button>
        </div>
      </div>
    </div>
  );
}