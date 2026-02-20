import configData from "@/data/config.json";
import anunciosData from "@/data/anuncios.json";
import depoimentosData from "@/data/depoimentos.json";

export interface Config {
  nome: string;
  slogan: string;
  descricao: string;
  telefones: { numero: string; label: string }[];
  whatsappPrincipal: string;
  endereco: { rua: string; cidade: string; estado: string; cep: string };
  horario: string;
  areasAtendimento: string[];
}

export interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  imagem: string;
  imagens?: string[];
  condicao?: "novo" | "usado";
  destaque?: boolean;
}

export function getAnuncioImages(a: Anuncio): string[] {
  if (a.imagens && a.imagens.length > 0) return a.imagens;
  return a.imagem ? [a.imagem] : [];
}

export interface Depoimento {
  id: string;
  nome: string;
  cidade: string;
  texto: string;
}

export const config: Config = configData as Config;
export const anuncios: Anuncio[] = anunciosData as Anuncio[];
export const depoimentos: Depoimento[] = depoimentosData as Depoimento[];

export function getAnunciosDestaque(): Anuncio[] {
  return anuncios.filter((a) => a.destaque);
}

export function buildWhatsAppMessage(
  type: "orcamento" | "agendar" | "produto",
  data?: Record<string, string>,
  cfg?: Config
): string {
  const prefix = "Olá! Vim pelo site da Refrigeração Pinheiral. ";
  if (type === "orcamento" && data) {
    return `${prefix}Gostaria de orçamento:\n*Nome:* ${data.nome}\n*Telefone:* ${data.telefone}\n*Cidade:* ${data.cidade}\n*Aparelho:* ${data.aparelho}\n*Problema:* ${data.descricao}`;
  }
  if (type === "agendar") {
    return `${prefix}Gostaria de agendar uma visita.`;
  }
  if (type === "produto" && data) {
    return `${prefix}Tenho interesse no anúncio: ${data.titulo} (${data.preco}).`;
  }
  return prefix;
}

export function getWhatsAppUrl(message: string, cfg?: Config): string {
  const c = cfg ?? config;
  const principal = (c as Config).whatsappPrincipal ?? config.whatsappPrincipal;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${principal}?text=${encoded}`;
}
