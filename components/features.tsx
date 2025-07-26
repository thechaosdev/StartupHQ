import { MessageSquare, Video, CheckSquare, FileText, Users, Brain } from 'lucide-react';

export function Features() {
  const features = [
    {
      title: "Chats",
      description: "Real-time team messaging and collaboration."
    },
    {
      title: "Meetings",
      description: "Schedule and join video meetings seamlessly."
    },
    {
      title: "Tasks",
      description: "Assign, track, and complete tasks efficiently."
    },
    {
      title: "Docs",
      description: "Create, edit, and share documents collaboratively."
    },
    {
      title: "Grant & Investor List",
      description: "Manage and track grants and investors in one place."
    },
    {
      title: "AI Brain",
      description: "Get smart suggestions and insights powered by AI."
    }
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Features</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything your startup need in one single space
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 mx-0 md:mx-12 lg:mx-28 relative">
  {features.map((feature, index) => (
    <div
      key={index}
      className="p-5 sm:p-6 rounded-xl bg-blue-100 border hover:border-blue-800 shadow-sm hover:shadow-lg transition-all relative z-0 flex flex-col"
    >
      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground text-sm">{feature.description}</p>
    </div>
  ))}
</div>
    </section>
  );
}