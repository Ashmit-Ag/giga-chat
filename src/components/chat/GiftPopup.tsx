import { useState, useEffect } from 'react';
import { LucideGift, X } from 'lucide-react';
import { Button } from "@/components/ui/button"; // Adjust path to your UI library
import { Slider } from "@/components/ui/slider"; // Adjust path to your UI library

const GiftPopup = ({ onClose, sendGift }: { onClose: () => void, sendGift: (amount: number) => void }) => {
  const [amount, setAmount] = useState<number>(100);

  const handleSend = async () => {
    const windowName = `payu_payment_${Date.now()}`
    const paymentWindow = window.open(
      'about:blank',
      windowName,
      'width=500,height=700'
    )
  
    if (!paymentWindow) {
      alert('Please allow pop-ups')
      return
    }

    paymentWindow.document.write(`
    <html>
      <head><title>Redirecting to PayU...</title></head>
      <body style="display:flex;align-items:center;justify-content:center;font-family:sans-serif">
        <h3>Redirecting to payment gateway…</h3>
      </body>
    </html>
  `)
  
    try {
      const res = await fetch('/api/gift/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
  
      if (!res.ok) throw new Error('Payment init failed')
  
      const { action, payload } = await res.json()
  
      // persist context
      localStorage.setItem('LAST_TEST_TXNID', payload.txnid)
      localStorage.setItem('LAST_GIFT_AMOUNT', String(amount))
  
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = action
      form.target = windowName
  
      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = String(value)
        form.appendChild(input)
      })
  
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
  
  
    } catch (err) {
      console.error(err)
      paymentWindow.close()
    }
  }

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
  
      if (event.data?.type === 'PAYU_PAYMENT_COMPLETED') {
        if (event.data.status === 'SUCCESS') {
          const amt = Number(localStorage.getItem('LAST_GIFT_AMOUNT'))
  
          sendGift(amt)
          onClose() // ✅ CLOSE GIFT POPUP
        }
  
        localStorage.removeItem('LAST_TEST_TXNID')
        localStorage.removeItem('LAST_GIFT_AMOUNT')
      }
    }
  
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [sendGift, onClose])
  
  

  return (
    <div className="fixed inset-0 bg-black/50  mx-auto flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-[90%] max-w-sm shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-amber-500">
            <LucideGift size={24} />
            <h2 className="text-xl font-bold text-white">Send a Gift</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Input & Slider Area */}
        <div className="space-y-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.min(10000, Math.max(0, Number(e.target.value))))}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white text-2xl font-bold focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="px-2[&_[data-orientation=horizontal]\_.relative]:bg-indigo-950 [&_.absolute]:bg-amber-500">
            <Slider
              value={[amount]}
              min={10}
              max={50000}
              step={10}
              onValueChange={(vals) => setAmount(vals[0])}
              className="cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
              <span>₹10</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleSend}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white py-6 text-lg font-bold rounded-lg shadow-lg shadow-amber-900/20"
          >
            Send Gift
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftPopup;