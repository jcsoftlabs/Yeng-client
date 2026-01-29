// Parcel status color configuration
// Used across all client portal pages for consistent status display

export const statusColors: Record<string, string> = {
    // Initial stages - Yellow/Amber tones
    'PENDING': 'bg-amber-100 text-amber-800 border-amber-300',

    // USA transit - Blue tones
    'IN_TRANSIT_USA': 'bg-blue-100 text-blue-800 border-blue-300',
    'DEPARTED_USA': 'bg-indigo-100 text-indigo-800 border-indigo-300',

    // Haiti transit - Purple/Violet tones
    'IN_TRANSIT_HAITI': 'bg-purple-100 text-purple-800 border-purple-300',
    'ARRIVED_HAITI': 'bg-violet-100 text-violet-800 border-violet-300',

    // Ready for customer - Cyan/Teal tones
    'READY_FOR_PICKUP': 'bg-cyan-100 text-cyan-800 border-cyan-300',

    // Completed - Green tones
    'PICKED_UP': 'bg-green-100 text-green-800 border-green-300',

    // Cancelled - Red tones
    'CANCELLED': 'bg-red-100 text-red-800 border-red-300',
};

// Status labels in French
export const statusLabels: Record<string, string> = {
    'PENDING': 'En attente',
    'IN_TRANSIT_USA': 'En transit (USA)',
    'DEPARTED_USA': 'A quitté USA',
    'IN_TRANSIT_HAITI': 'En transit vers Haiti',
    'ARRIVED_HAITI': 'Arrivé en Haiti',
    'READY_FOR_PICKUP': 'Prêt pour récupération',
    'PICKED_UP': 'Récupéré',
    'CANCELLED': 'Annulé',
};

// Status icons mapping (for use with lucide-react)
export const statusIcons = {
    'PENDING': 'Clock',
    'IN_TRANSIT_USA': 'Plane',
    'DEPARTED_USA': 'PlaneTakeoff',
    'IN_TRANSIT_HAITI': 'Ship',
    'ARRIVED_HAITI': 'Warehouse',
    'READY_FOR_PICKUP': 'PackageCheck',
    'PICKED_UP': 'CheckCircle',
    'CANCELLED': 'XCircle',
} as const;

// Helper function to get status color with fallback
export function getStatusColor(status: string): string {
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
}

// Helper function to get status label with fallback
export function getStatusLabel(status: string): string {
    return statusLabels[status] || status;
}
