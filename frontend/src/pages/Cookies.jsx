import { Cookie } from "lucide-react";

export default function Cookies() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Cookie size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Política de Cookies</h1>
            <p className="text-sm text-slate-400">Última actualização: Junho de 2026</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">1. O que são Cookies</h2>
            <p>
              Cookies são pequenos ficheiros de texto guardados no teu dispositivo quando visitas a nossa plataforma, permitindo reconhecer o teu navegador em visitas futuras.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">2. Tipos de Cookies que Utilizamos</h2>
            <p>
              Utilizamos cookies essenciais para manter o carrinho de compras durante a navegação, cookies analíticos para compreender o comportamento de navegação e melhorar a plataforma, e cookies de sessão para identificar visitas de forma anónima.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">3. Pixel de Rastreamento</h2>
            <p>
              Utilizamos um sistema próprio de pixel de rastreamento para registar eventos como visualizações de página, adições ao carrinho e conclusões de compra, com o objectivo de melhorar continuamente a experiência de compra.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">4. Como Gerir Cookies</h2>
            <p>
              Podes gerir ou desactivar cookies através das configurações do teu navegador. Note que desactivar certos cookies pode afectar funcionalidades como a persistência do carrinho de compras.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-800 text-lg mb-3">5. Cookies de Terceiros</h2>
            <p>
              Não utilizamos cookies de publicidade de terceiros nem partilhamos dados de navegação com redes de anúncios externas.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}