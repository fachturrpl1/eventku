import { events } from "@/data/events";
import KatalogInteraktif from "@/app/components/KatalogInteraktif";

export default function Katalog() {
  return (
    <div className="">
      <h1 className="mb-4 text-2xl font-bold">Katalog Event</h1>
      <KatalogInteraktif events={events}/>
    </div>
  );
}
