"use client";

import { useEffect, useState } from "react";
import { HeartPulse, Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { successStories } from "./landing.constants";
import { getInitials } from "./landing.helpers";

export function SuccessStories() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const autoplay = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 3600);

    return () => window.clearInterval(autoplay);
  }, [carouselApi]);

  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:gap-10">
        <div className="mx-auto grid max-w-2xl gap-3 text-center">
          <p className="mx-auto inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-[14px] font-semibold capitalize leading-snug tracking-[0.12em] text-red-700 shadow-sm sm:px-4 sm:tracking-[0.14em]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-700 text-white shadow-lg shadow-red-700/50">
              <HeartPulse className="h-4 w-4" aria-hidden />
            </span>
            Community voices
          </p>

          <h2 className="text-3xl font-bold tracking-normal text-slate-900 sm:text-4xl">
            Trusted experiences from verified donors and families
          </h2>

          <p className="text-sm font-medium leading-6 text-neutral-600 sm:text-base sm:leading-7">
            Short reflections from donors and families who used LifeDrop to search by
            blood group and city—and move faster toward care.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setCarouselApi}
          className="mx-auto w-full max-w-7xl"
        >
          <CarouselContent className="-ml-4 py-2">
            {successStories.map((story) => (
              <CarouselItem
                key={story.name}
                className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="group h-full overflow-hidden rounded-[1.35rem] border border-red-100/80 bg-white shadow-[0_18px_45px_rgba(127,29,29,0.08)] transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_24px_60px_rgba(127,29,29,0.14)]">
                  <CardContent className="relative grid h-full gap-5 p-5 sm:p-6">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#dc2626,#fb923c,#dc2626)] opacity-80" />
                    <div className="pointer-events-none absolute right-5 top-5 text-red-50 transition duration-300 group-hover:text-red-100">
                      <Quote className="h-16 w-16 fill-current stroke-0" />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-14 w-14 border border-red-100 bg-red-50 shadow-md shadow-red-950/10 ring-4 ring-red-50">
                          {story.avatar ? (
                            <AvatarImage alt={story.name} src={story.avatar} />
                          ) : null}

                          <AvatarFallback className="bg-red-50 text-sm font-bold text-red-700">
                            {getInitials(story.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-neutral-950">
                            {story.name}
                          </h3>
                          <p className="text-sm font-medium text-neutral-500">
                            {story.city}
                          </p>
                        </div>
                      </div>

                      <Badge className="relative z-10 shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-red-700 ring-1 ring-red-100">
                        {story.bloodGroup}
                      </Badge>
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-4 rounded-2xl border border-red-50 bg-red-50/45 px-3 py-3">
                      <div
                        className="flex gap-1 text-amber-500"
                        aria-label="5 star rating"
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star className="h-4 w-4 fill-current" key={index} />
                        ))}
                      </div>
                      <span className="text-xs font-black uppercase text-red-700/55">
                        Verified story
                      </span>
                    </div>

                    <p className="relative z-10 text-sm font-semibold leading-7 text-neutral-600">
                      &ldquo;{story.message}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-4 hidden h-11 w-11 border-red-100 bg-white text-red-700 shadow-xl shadow-red-950/10 ring-4 ring-white hover:bg-red-700 hover:text-white sm:flex" />
          <CarouselNext className="-right-4 hidden h-11 w-11 border-red-100 bg-white text-red-700 shadow-xl shadow-red-950/10 ring-4 ring-white hover:bg-red-700 hover:text-white sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
