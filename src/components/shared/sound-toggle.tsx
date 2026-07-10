"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/components/providers/sound-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SoundToggle() {
  const { muted, toggleMuted } = useSound();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-sound-toggle=""
            aria-label={muted ? "Unmute interface sounds" : "Mute interface sounds"}
            aria-pressed={!muted}
            onClick={toggleMuted}
            className="size-9"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
        }
      />
      <TooltipContent>{muted ? "Unmute sounds" : "Mute sounds"}</TooltipContent>
    </Tooltip>
  );
}
