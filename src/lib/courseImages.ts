import guitarImg from "@/assets/courses/guitar.jpg";
import pianoImg from "@/assets/courses/piano.jpg";
import drumsImg from "@/assets/courses/drums.jpg";
import fluteImg from "@/assets/courses/flute.jpg";
import ukuleleImg from "@/assets/courses/ukulele.jpg";
import tablaImg from "@/assets/courses/tabla.jpg";
import vocalsImg from "@/assets/courses/vocals.jpg";
import cajonImg from "@/assets/courses/cajon.jpg";
import harmoniumImg from "@/assets/courses/harmonium.jpg";

export const courseImages: Record<string, string> = {
  Guitar: guitarImg,
  Piano: pianoImg,
  Drums: drumsImg,
  Flute: fluteImg,
  Ukulele: ukuleleImg,
  Tabla: tablaImg,
  "Vocals (Hindustani Classical)": vocalsImg,
  "Cajon (Clap Box)": cajonImg,
  Harmonium: harmoniumImg,
};

export function getCourseImage(title: string): string {
  return courseImages[title] || guitarImg;
}
