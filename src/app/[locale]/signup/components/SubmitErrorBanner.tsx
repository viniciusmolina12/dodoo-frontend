interface SubmitErrorBannerProps {
  message: string;
}

export function SubmitErrorBanner({ message }: SubmitErrorBannerProps) {
  return (
    <div className="mb-3.5 px-3.5 py-2.5 rounded-xl bg-[#FFF0EE] border border-error text-[13px] font-bold text-error leading-snug">
      {message}
    </div>
  );
}
