"use client";

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#4F7CFF] text-white shadow-[0_0_20px_rgba(79,124,255,0.4)] hover:shadow-[0_0_40px_rgba(79,124,255,0.6)] hover:bg-[#7B5CFF] border border-white/20 hover:scale-[1.02]",
        outline:
          "bg-white/10 backdrop-blur-md border border-white/40 text-[#0A121A] hover:bg-white/30 hover:border-[#2FD9FF]/50 hover:shadow-[0_0_30px_rgba(47,217,255,0.2)] hover:scale-[1.02]",
        secondary:
          "bg-[#7B5CFF]/10 text-[#7B5CFF] hover:bg-[#7B5CFF]/20 border border-[#7B5CFF]/20 hover:scale-[1.02]",
        ghost:
          "hover:bg-[#4F7CFF]/10 hover:text-[#4F7CFF]",
        destructive:
          "bg-[#FF6B81]/10 text-[#FF6B81] hover:bg-[#FF6B81]/20",
        link: "text-[#4F7CFF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        xs: "h-8 px-3 text-xs rounded-lg",
        sm: "h-9 px-4 text-sm rounded-lg",
        lg: "h-14 px-8 text-base rounded-2xl",
        icon: "size-10",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, magnetic = true, children, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!magnetic) return;
      const node = buttonRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      x.set(distanceX * 0.2);
      y.set(distanceY * 0.2);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const content = (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        {/* Soft ripple glow overlay */}
        <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors duration-300 rounded-[inherit]" />
      </ButtonPrimitive>
    );

    if (!magnetic) {
      return (
        <motion.div whileTap={{ scale: 0.98 }} className="inline-block w-fit">
          {content}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: mouseXSpring, y: mouseYSpring }}
        whileTap={{ scale: 0.96 }}
        className="inline-block"
      >
        {content}
      </motion.div>
    );
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
