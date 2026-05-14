"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
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
          <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
            Success stories
          </p>

          <h2 className="text-3xl font-bold tracking-normal text-slate-900 sm:text-4xl">
            Trusted by people who act fast
          </h2>

          <p className="text-sm font-medium leading-6 text-neutral-600 sm:text-base sm:leading-7">
            Real moments from donors and families using LifeDrop to connect with
            care.
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
                <Card className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg shadow-red-950/5 transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/10">
                  <CardContent className="grid h-full gap-5 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-12 w-12 border border-red-100 bg-red-50 shadow-sm shadow-red-950/5">
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

                      <Badge className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-red-700 ring-1 ring-red-100">
                        {story.bloodGroup}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-y border-neutral-100 py-3">
                      <div
                        className="flex gap-1 text-amber-500"
                        aria-label="5 star rating"
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star className="h-4 w-4 fill-current" key={index} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold uppercase text-neutral-400">
                        Verified story
                      </span>
                    </div>

                    <p className="text-sm font-medium leading-6 text-neutral-600">
                      &ldquo;{story.message}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-4 hidden h-10 w-10 border-red-200 bg-white text-red-700 shadow-lg shadow-red-950/10 hover:bg-red-50 hover:text-red-800 sm:flex" />
          <CarouselNext className="-right-4 hidden h-10 w-10 border-red-200 bg-white text-red-700 shadow-lg shadow-red-950/10 hover:bg-red-50 hover:text-red-800 sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
