import { ImageHeaderCard } from "@/components/ImageHeaderCard";
import featureImage from "@/assets/me.jpg";

export function FounderTalk() {
  return (
    <section className="py-12 px-4">
      <ImageHeaderCard
        imageSrc={featureImage}
        imageAlt="Collaborative coding session"
        title="Hi, it's Rehman From StartupHQ"
        description={
          <>
            <p>
                <b>
                I used to hate how exhausting connecting with teams are.</b>


            </p>
            <p>
            I loved building startups, 
            <br />
but managing them?
<br />
That was a nightmare.
            </p>
            <p>
            Chats, Tasks, Docs,<br />
            it all felt like a chore.
            <br />
            So I get fedup.</p>
            <p>
            One tasks, a week became one a month… 
            <br />then none.</p>
            <p>
                <b>
                That’s why I built StartupHQ.</b></p>
            <p>
            An Platform that makes managing startups like butter,
<br />
so you stop overthinking and start build efficiently.</p>
          </>
        }
        imageClassName="rounded-full"
        containerClassName="p-8 rounded-2xl"
      />
    </section>
  );
}