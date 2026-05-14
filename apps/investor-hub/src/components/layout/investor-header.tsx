"use client";

import { Bell, Wallet } from "lucide-react";
import { Button, Avatar, AvatarFallback } from "@lumora/ui";
import { shortenAddress } from "@lumora/ui";
import { useWallet } from "@/hooks/use-wallet";

export function InvestorHeader() {
  const { address, connect, disconnect, isConnected } = useWallet();
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-gray-950 px-6">
      <div />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
        </Button>
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{address.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-white">{shortenAddress(address)}</p>
              <p className="text-[10px] text-gray-500">Investor</p>
            </div>
            <Button variant="outline" size="sm" onClick={disconnect}>Disconnect</Button>
          </div>
        ) : (
          <Button variant="lumora" size="sm" onClick={connect}>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
