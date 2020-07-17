export enum RoomStatus {
    All = 1,
    Available = 2,
    Checkin = 3,
    Booking = 4,
}

export enum RoomType {
    Single = 1,
    Double = 2,
}

export enum ActionType {
    None ,
    Available ,
    Checkin ,
    Checkout ,
    Edit,
    BookingNow,
    CheckoutNow,
    CheckinNow
}

export enum AppLookupDataType {
    Services = 'Services',
}

export enum TransferOption {
    SeparateAndMerge = 1,
    CaculatedFromBeginning= 2
}

export enum ActionNavigationType {
    Edit,
    AddToBookingList,
    AddToCheckoutList,
    BookingNow,
    CheckoutNow,
    TransferRoom,
    AddToCheckinList,
    RemoveCheckin
}
