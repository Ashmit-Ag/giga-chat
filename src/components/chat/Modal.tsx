'use client'

import { useEffect, useState } from 'react'
import { X, Sparkles, Check, Star, IndianRupee, CheckCircle2, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Carousel } from '@mantine/carousel'
import '@mantine/carousel/styles.css'

interface Plan {
  id: string
  name: string
  price: number
  [key: string]: any
}

interface PremiumModalProps {
  open: boolean
  onClose: () => void
}

const EXCLUDED_KEYS = ['id', 'name', 'createdAt', 'updatedAt', 'price']

const formatLabel = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())

const extractFeatures = (plan: Plan): string[] =>
  Object.entries(plan)
    .filter(([k, v]) => !EXCLUDED_KEYS.includes(k) && v !== false)
    .map(([k, v]) =>
      typeof v === 'boolean' ? formatLabel(k) : `${formatLabel(k)}: ${v}`
    )

const gradients: Record<string, string> = {
  Basic: 'from-indigo-500 via-purple-500 to-pink-500',
  Premium: 'from-orange-500 via-rose-500 to-amber-500'
}

export default function PremiumModal({ open, onClose }: PremiumModalProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return

    const fetchPlans = async () => {
      const res = await fetch('/api/admin/plans')
      const data = await res.json()
      setPlans(data.filter((p: Plan) => p.name !== 'Free'))
      setLoading(false)
    }

    fetchPlans()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center px-4">
      <div className="relative w-full max-w-md bg-[#0b1022] rounded-[28px] border border-white/10 px-5 py-6">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X />
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400 w-5 h-5" />
            Pricing Plan
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Upgrade your experience
          </p>
        </div>

        {/* CAROUSEL */}
        {loading ? (
          <div className="text-center text-white/60 py-20">
            Loading plans...
          </div>
        ) : (
          <Carousel
            slideSize="90%"
            slideGap="lg"
            // align="center"
            // slidesToScroll={1}
            withIndicators
            // loop
            className=""
            styles={{
              indicators: {
                bottom: -14
              },
              indicator: {
                width: 18,
                height: 6,
                borderRadius: 999
              }
              
            }}
            classNames={{
              indicator: 'data-[active]:!bg-white data-[passive]:!bg-white'
            }}
          >


            {plans.map(plan => {
              const features = extractFeatures(plan)
              const gradient =
                gradients[plan.name] ?? 'from-indigo-500 to-pink-500'
              const isPremium = plan.name === 'Premium'

              return (
                <Carousel.Slide key={plan.id}>
                  <div
                    className={`
                      relative rounded-2xl p-0.5
                      bg-linear-to-br ${gradient}
                      h-120 mx-2
                    `}
                  >
                    {isPremium && (
                      <div className="absolute top-6 right-4 bg-linear-to-r from-orange-500 to-amber-500 text-[10px] px-3 py-1 rounded-full text-white font-bold flex items-center gap-1 z-10">
                        <Star className="w-3 h-3" />
                        MOST POPULAR
                      </div>
                    )}

                    <div className="rounded-2xl bg-[#0e1326] px-6 pt-6 pb-4 flex flex-col h-full">

                      {/* PLAN NAME */}
                      <div className="text-white text-lg font-bold">
                        {plan.name}
                      </div>

                      {/* PRICE */}
                      <div className="flex items-end gap-1 text-white mt-1">
                        <IndianRupee className="w-5 h-5 mb-1" />
                        <span className="text-3xl font-extrabold">
                          {plan.price}
                        </span>
                        <span className="text-white/60 text-sm">/month</span>
                      </div>

                      {/* FEATURES (SCROLLABLE) */}
                      <div className="mt-5 space-y-3 text-sm text-white/80 overflow-y-auto pr-2 flex-1 amber-scrollbar">
                        {features.map((feature, i) => (
                          <div key={i} className="flex gap-2">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA (STAYS FIXED) */}
                      <Button
                        className={`mt-4 w-full text-base font-bold bg-linear-to-r ${gradient}`}
                      >
                        Choose Plan
                      </Button>
                    </div>
                  </div>
                </Carousel.Slide>

              )
            })}
          </Carousel>
        )}
      </div>
    </div>
  )
}
