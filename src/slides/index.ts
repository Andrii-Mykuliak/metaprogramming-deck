import type { SlideDef } from "../deck/steps";
import { agendaSlide, introSlides } from "./intro";
import { s1Slides } from "./s1-concept";
import { s2Slides } from "./s2-ast";
import { s3Slides } from "./s3-compile";
import { s4Slides } from "./s4-runtime";
import { s5Slides, summarySlide } from "./s5-uses";
import { outroSlide } from "./outro";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  ...s1Slides,
  agendaSlide(1),
  ...s2Slides,
  agendaSlide(2),
  ...s3Slides,
  agendaSlide(3),
  ...s4Slides,
  agendaSlide(4),
  ...s5Slides,
  summarySlide,
  outroSlide,
];
