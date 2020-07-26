export enum RoomStatus {
    Available = 1,
    Checkin = 2,
    Booking = 3,
}

export enum RoomType {
    All,
    Single,
    Double,
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
