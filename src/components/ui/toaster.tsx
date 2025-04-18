import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="
            shadow-md cursor-pointer"
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="font-medium tracking-wider text-sm">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-xs font-medium tracking-wider">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="active:ring-0 text-white hover:text-white" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
