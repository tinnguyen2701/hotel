import {RoomStatus, RoomType} from '@app/modules/admin/shared/enums';

export const ADMIN_MENU = [
    {
        text: 'Rooms',
        link: '/admin/all',
        icon: 'fas fa-address-book'
    },
    {
        text: 'Booked',
        link: '/admin/booked',
        icon: 'fas fa-address-book'
    }
];

export const ROOM_STATUS_TYPE: { value: RoomStatus, name: string }[] = [
    {value: RoomStatus.All, name: 'All'},
    {value: RoomStatus.Available, name: 'Available'},
    {value: RoomStatus.Checkin, name: 'Checkin'},
    {value: RoomStatus.Booking, name: 'Booking'},
];

export const ROOM_TYPE: { value: RoomType, name: string }[] = [
    {value: RoomType.Single, name: 'Phòng đơn'},
    {value: RoomType.Double, name: 'Phòng đôi'},
];
