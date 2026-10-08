'use client'
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'

import messages from '@/messages.json'

const page = () => {
  return (
    <main className='flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:px-24'>
      <section className='max-w-4xl text-center'>
        <h1 className='text-3xl md:text-5xl font-bold'>
          Dive into the world of Anonymous conversations-where your identity remains secret.
        </h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore mystry message</p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="mx-auto w-full max-w-[10rem] sm:max-w-xs"
      >
        <CarouselContent>
          {
            messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

    </main>
  )
}

export default page
