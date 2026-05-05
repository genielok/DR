import { X } from "lucide-react";
import { F } from "../const";

interface ImageLightboxProps {
  image: { url: string; commonName: string; scientificName: string } | null;
  onClose: () => void;
}

export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[32px]"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-[40px] right-0 text-[rgba(255,255,255,0.9)] hover:text-[#778192] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
        <img
          src={image.url}
          alt={image.commonName}
          loading="lazy"
          decoding="async"
          className="w-full"
        />
        <div className="mt-[12px] text-center">
          <div
            className="text-[16px] text-[rgba(255,255,255,0.9)]"
            style={{ fontFamily: F.bold }}
          >
            {image.commonName || (
              <span className="italic text-[#778192]" style={{ fontFamily: F.regular }}>
                Common name unknown
              </span>
            )}
          </div>
          <div
            className="text-[12px] italic text-[#778192] mt-[4px]"
            style={{ fontFamily: F.regular }}
          >
            {image.scientificName}
          </div>
        </div>
      </div>
    </div>
  );
}
