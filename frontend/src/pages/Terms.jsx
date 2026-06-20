import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Termos e Condições</h1>
            <p className="text-sm text-slate-400">Última actualização: Junho de 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao aceder e utilizar a plataforma OSOTEC, o utilizador concorda em ficar vinculado aos presentes Termos e Condições. Caso não concorde com qualquer parte destes termos, recomendamos que não utilize os nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">2. Produtos e Preços</h2>
            <p>
              Todos os preços apresentados estão em Kwanzas (Kz) e podem ser alterados sem aviso prévio. A OSOTEC reserva-se o direito de corrigir erros de preços ou descrições, mesmo após a confirmação de uma encomenda.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">3. Processo de Compra</h2>
            <p>
              As encomendas são confirmadas após o preenchimento completo dos dados do cliente e a selecção de uma forma de pagamento válida. Não é necessário criar conta para efectuar uma compra.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">4. Formas de Pagamento</h2>
            <p>
              Aceitamos pagamento via Cartão Multicaixa/TPA, Transferência Bancária e Pagamento na Entrega. Os dados de cartão fornecidos são processados de forma segura e não são armazenados nos nossos servidores.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">5. Entrega</h2>
            <p>
              Os prazos de entrega variam de acordo com a província de destino. O estado da encomenda pode ser acompanhado em tempo real através da secção de Rastreamento.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">6. Devoluções e Trocas</h2>
            <p>
              Produtos com defeito de fabrico podem ser devolvidos ou trocados dentro de 7 dias após a entrega, mediante abertura de um ticket de suporte com a respectiva justificação.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">7. Limitação de Responsabilidade</h2>
            <p>
              A OSOTEC não se responsabiliza por danos indirectos resultantes do uso inadequado dos produtos adquiridos, nem por atrasos causados por motivos de força maior.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">8. Contacto</h2>
            <p>
              Para qualquer questão relacionada com estes Termos, contacte-nos através de suporte@osotec.ao ou abra um ticket na secção de Suporte.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}