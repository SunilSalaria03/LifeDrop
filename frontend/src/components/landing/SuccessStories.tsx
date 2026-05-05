import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const stories = [
  {
    name: "Chaman Singh",
    city: "Mohali",
    bloodGroup: "O+",
    message:
      "LifeDrop helped us find a nearby donor quickly during an emergency. The search was simple and reassuring.",
    avatar: "",
  },
  {
    name: "Rohit Sharma",
    city: "Chandigarh",
    bloodGroup: "A+",
    message:
      "I registered as a donor and got connected with a real request in my city. The process felt clear and respectful.",
    avatar: "",
  },
  {
    name: "Aniket Sharma",
    city: "Panchkula",
    bloodGroup: "B+",
    message:
      "The donor details were easy to review, and the privacy note made the experience feel trustworthy.",
    avatar: "",
  },
  {
    name: "Shivam Plaha",
    city: "Chandigarh",
    bloodGroup: "A+",
    message:
      "I registered as a donor and got connected with a real request in my city. The process felt clear and respectful.",
    avatar: "",
  },
  {
    name: "Sachin Arora",
    city: "Panchkula",
    bloodGroup: "B+",
    message:
      "The donor details were easy to review, and the privacy note made the experience feel trustworthy.",
    avatar: "",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function SuccessStories() {
  return (
    <section className="bg-[linear-gradient(135deg,#fff7f7_0%,#ffffff_45%,#f8fbff_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase text-red-600">
            Success stories
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-normal text-neutral-950 sm:text-4xl">
            Trusted by people who act fast
          </h2>

          <p className="mt-4 text-base leading-7 text-neutral-600">
            Real moments from donors and families using LifeDrop to connect with
            care.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="mx-auto w-full max-w-7xl"
        >
          <CarouselContent className="-ml-4">
            {stories.map((story) => (
              <CarouselItem
                key={story.name}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full rounded-2xl border-red-100/70 bg-white/95 shadow-lg shadow-red-950/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/10">
                  <CardContent className="grid h-full gap-5 p-6 lg:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-12 w-12 border border-red-100 bg-red-50">
                          {story.avatar ? (
                            <AvatarImage alt={story.name} src={story.avatar} />
                          ) : null}

                          <AvatarFallback className="bg-red-50 text-red-700">
                            {getInitials(story.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-neutral-950">
                            {story.name}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {story.city}
                          </p>
                        </div>
                      </div>

                      <Badge className="bg-red-50 text-red-700 ring-1 ring-red-100">
                        {story.bloodGroup}
                      </Badge>
                    </div>

                    <div
                      className="flex gap-1 text-red-500"
                      aria-label="5 star rating"
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star className="h-4 w-4 fill-current" key={index} />
                      ))}
                    </div>

                    <p className="text-sm leading-6 text-neutral-600">
                      “{story.message}”
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-4 hidden border-red-100 text-red-600 hover:bg-red-50 sm:flex" />
          <CarouselNext className="-right-4 hidden border-red-100 text-red-600 hover:bg-red-50 sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}