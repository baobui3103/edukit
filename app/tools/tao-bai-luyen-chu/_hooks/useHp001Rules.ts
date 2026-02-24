"use client";

import { useEffect, useState } from "react";
import type { ReplacementRule } from "../_lib/types";

export function useHp001Rules() {
  const [rules, setRules] = useState<ReplacementRule[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/hp001-rules")
      .then((r) => r.json())
      .then((data: { rules?: ReplacementRule[]; error?: string }) => {
        if (!isMounted) return;
        if (Array.isArray(data.rules) && data.rules.length > 0) {
          setRules(data.rules);
        } else {
          console.error("Không tải được HP001 rules:", data.error);
          setRules([]);
        }
      })
      .catch((err) => {
        console.error("Không tải được HP001 rules:", err);
        if (isMounted) setRules([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return rules;
}
