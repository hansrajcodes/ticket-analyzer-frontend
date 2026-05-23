import { useDropzone } from "react-dropzone";
import { FileText, Image as ImageIcon, UploadCloud, X } from "lucide-react";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function FileDropzone({ files, setFiles, disabled }) {
  const onDrop = (accepted) => {
    setFiles((prev) => {
      const next = [...prev];
      for (const f of accepted) {
        const dup = next.find((x) => x.name === f.name && x.size === f.size);
        if (!dup) next.push(f);
      }
      return next.slice(0, 8);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 8,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl px-6 py-10 text-center transition-all duration-200 sm:py-14 ${
          isDragActive
            ? "bg-primary-50 shadow-glow ring-2 ring-primary-300"
            : "bg-ink-50 shadow-ring hover:bg-white hover:shadow-card"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
          <UploadCloud size={24} />
        </span>
        <p className="mt-4 text-base font-semibold text-ink-900">
          {isDragActive ? "Drop the files here" : "Drag & drop booking documents"}
        </p>
        <p className="mt-1 text-xs text-ink-500">
          or click to choose — PDF, JPG, PNG, WEBP — up to 10&nbsp;MB each (max 8)
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 shadow-soft transition-shadow hover:shadow-card animate-fade-in-up"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                    f.type === "application/pdf"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {f.type === "application/pdf" ? (
                    <FileText size={16} />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{f.name}</p>
                  <p className="text-xs text-ink-500">{formatSize(f.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={disabled}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Remove ${f.name}`}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
