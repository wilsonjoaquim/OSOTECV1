import { Lock } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Lock size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Política de Privacidade</h1>
            <p className="text-sm text-slate-400">Última actualização: Junho de 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">1. Dados que Recolhemos</h2>
            <p>
              Recolhemos informações fornecidas directamente por ti durante o processo de compra, nomeadamente nome completo, NIF, telefone, endereço de entrega e dados de pagamento necessários para processar a encomenda.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">2. Como Utilizamos os Dados</h2>
            <p>
              Os dados recolhidos são utilizados exclusivamente para processar encomendas, efectuar entregas, prestar suporte técnico e melhorar a experiência na nossa plataforma através de análise de comportamento de navegação.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">3. Partilha de Dados</h2>
            <p>
              Não vendemos nem partilhamos os teus dados pessoais com terceiros para fins de marketing. Os dados podem ser partilhados apenas com parceiros de logística estritamente necessários para a entrega da encomenda.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">4. Segurança dos Dados</h2>
            <p>
              Implementamos medidas técnicas e organizativas para proteger os teus dados, incluindo cifragem de comunicações e limitação de acesso interno à informação sensível.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">5. Retenção de Dados</h2>
            <p>
              Os dados de encomendas são conservados durante o período necessário para cumprir obrigações legais e fiscais aplicáveis em Angola.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">6. Os Teus Direitos</h2>
            <p>
              Podes solicitar a qualquer momento o acesso, correcção ou eliminação dos teus dados pessoais, contactando-nos através de suporte@osotec.ao.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">7. Alterações a esta Política</h2>
            <p>
              Esta Política de Privacidade pode ser actualizada periodicamente. Recomendamos a sua consulta regular para te manteres informado sobre eventuais alterações.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}