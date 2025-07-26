import { Code, Github, Music, Users, MessageSquare, Video } from "lucide-react"
import { WobbleCard } from "./ui/wobble-card"
import jam from "@/assets/jam.jpg"
import chat from "@/assets/chat.jpg"
import cowork from "@/assets/cowork.jpg"


export function FeatureSection() {
  const features = [
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Real-time Collaborative Coding",
      image: "https://teleporthq.io/share-code-collaborate-real-time-400w.png",
      description: "Code together with up to 4 developers simultaneously on the same file with real-time updates.",
    },
    {
      icon: <Github className="h-10 w-10 text-primary" />,
      title: "GitHub Integration",
      image: "https://i.ytimg.com/vi/ftGSgHVSXs8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBMDod23NouNpjaWKHm1Pi7iPUDpQ",
      description: "Seamlessly import, push, and pull from your GitHub repositories without leaving the platform.",
    },
    {
      icon: <Music className="h-10 w-10 text-primary" />,
      title: "Built-in Music Player",
      image: "https://play-lh.googleusercontent.com/gS-5V01zUO4LSMr_EDyv3yPcF1fMXsMoh_LZ36LsiICkWWHX6maA8l3nKO84OnvJtuQZ=w648-h364-rw",
      description: "Set the mood with a customizable music player that everyone in the room can enjoy.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Public & Private Jam Rooms",
      image: jam.src,
      description: "Create your own coding space and invite friends or keep it open for collaboration.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      title: "Text & Voice Chat",
      image: chat.src,
      description: "Communicate effectively with built-in text and voice chat functionality.",
    },
    {
      icon: <Video className="h-10 w-10 text-primary" />,
      title: "Virtual Co-working Space",
      image: cowork.src,
      description: "Feel like you're coding side by side with a virtual co-working environment.",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Everything You Need to Jam</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mt-8 mx-auto">
            Weekend Jamming combines the best tools for collaborative coding and socializing in one seamless platform.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div> */}

<div className="mt-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
{features.map((feature, index) => (
  <WobbleCard
                        image={typeof feature.image === "string" ? feature.image : feature.image}
                        containerClassName="h-full bg-black min-h-[300px] lg:min-h-[300px]"
                        className=""
                    >
                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                {feature.title}
                            </h2>
                            <p className="mt-8 text-left text-base/6 text-white">
                            {feature.description}
                            </p>
                        </div>
                    </WobbleCard>
))}
                </div>
      </div>
    </section>
  )
}

