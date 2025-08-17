import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// This component will be automatically displayed by Next.js 
// while the ticket detail page fetches data.
export default function TicketDetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" disabled>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
            </div>
            <div className="animate-pulse">
                {/* Skeleton for Header */}
                <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
                
                {/* Skeleton for Ticket Info Card */}
                <div className="h-24 bg-muted rounded mb-6"></div>

                {/* Skeleton for Chat/Discussion Card */}
                <div className="h-96 bg-muted rounded"></div>
            </div>
        </div>
    );
}
