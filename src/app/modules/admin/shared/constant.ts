import {StatusBooking, RoomStatus, RoomType} from '@app/modules/admin/shared/enums';

export const ADMIN_MENU = [
    {
        text: 'All Rooms',
        link: '/admin/all',
        icon: 'fas fa-address-book'
    },
    {
        text: 'Booked',
        link: '/admin/booked',
        icon: 'fas fa-address-book'
    },
    // {
    //     text: 'Dashboard',
    //     link: '/admin/dashboard',
    //     icon: 'fas fa-home'
    // },
    // {
    //     text: 'Bookings',
    //     link: '/admin/bookings',
    //     icon: 'fas fa-address-book'
    // },
    // {
    //     text: 'User List',
    //     link: '/admin/users',
    //     icon: 'fas fa-users'
    // },
    // {
    //     text: 'Boats',
    //     icon: 'fas fa-ship',
    //     link: '/admin/boats',
    //     items: [
    //         {
    //             text: 'Partner List',
    //             link: '/admin/boats/partners'
    //         },
    //         {
    //             text: 'Boat List',
    //             link: '/admin/boats/list'
    //         },
    //         {
    //             text: 'Schedule',
    //             link: '/admin/boats/schedule'
    //         }
    //     ]
    // },
    // {
    //     text: 'Revenue',
    //     link: '/admin/revenue',
    //     icon: 'fas fa-funnel-dollar'
    // }
];

export const STATUS_METHOD: { value: StatusBooking, name: string }[] = [
    {value: StatusBooking.Paid, name: 'Paid'},
    {value: StatusBooking.Complete, name: 'Complete'},
    {value: StatusBooking.BookingAccepted, name: 'Booking accepted'},
    {value: StatusBooking.BookingRequested, name: 'Booking requested'}
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
