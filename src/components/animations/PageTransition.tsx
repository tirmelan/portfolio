"use client";

/**
 * PageTransition — soft fade-in on every page navigation.
 *
 * TO REMOVE: delete this file, then in app/(site)/layout.tsx replace
 * <PageTransition>{children}</PageTransition> with just {children}.
 */

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
