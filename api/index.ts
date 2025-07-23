// api/index.ts
import { createApp } from "h3";
import { toNodeListener } from "h3";

export default toNodeListener(createApp());
