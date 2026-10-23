// La caja de fiddle (TarjetaCaja) pide el router de Next. En un vídeo no se navega:
// esto lo sustituye (alias en remotion.config.ts) para poder pintar la caja de verdad.

const router = { push() {}, replace() {}, refresh() {}, back() {}, forward() {}, prefetch() {} };

export const useRouter = () => router;
export const usePathname = () => "/";
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});
export function redirect(): never {
  throw new Error("redirect() no existe en un vídeo");
}
export function notFound(): never {
  throw new Error("notFound() no existe en un vídeo");
}
