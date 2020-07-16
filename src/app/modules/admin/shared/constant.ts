import {RoomStatus, RoomType, TransferOption} from '@app/modules/admin/shared/enums';

export const ADMIN_MENU = [
    {
        text: 'Rooms',
        link: '/admin/all',
        icon: 'fa fa-university'
    },
    {
        text: 'Booked',
        link: '/admin/booked',
        icon: 'fas fa-address-book'
    },
    {
        text: 'Revenue',
        link: '/admin/revenue',
        icon: 'fa fa-university'
    }
];

export const ROOM_STATUS_TYPE: { value: RoomStatus, name: string }[] = [
    {value: RoomStatus.All, name: 'All'},
    {value: RoomStatus.Available, name: 'Available'},
    {value: RoomStatus.Checkin, name: 'Checkin'},
    {value: RoomStatus.Booking, name: 'Booking'},
];

export const ROOM_TYPE: { value: RoomType, name: string }[] = [
    {value: RoomType.Single, name: 'Single Room'},
    {value: RoomType.Double, name: 'Double Room'},
];

export const TRANSFER_ROOM_TYPE: { value: number, name: string }[] = [
    {value: TransferOption.SeparateAndMerge, name: 're-calculate from the beginning according to the room transfer price'},
    {value: TransferOption.CaculatedFromBeginning, name: 'Separate the old room bill and merge it into the room that will move in'}
];
