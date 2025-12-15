import {
  User,
  Organization,
  OrganizationMembership,
  Horse,
  HorseAccess,
  Appointment,
  MedicalRecord,
  Notification,
  Conversation,
} from '@/types';

// Current Vet User
export const currentUser: User = {
  id: 'vet-001',
  name: 'د. أحمد الفارس',
  email: 'dr.ahmed@vetconnect.com',
  phone: '+966 50 123 4567',
  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
  role: 'vet',
  specialization: 'طب الخيول',
  licenseNumber: 'VET-2024-1234',
  createdAt: new Date('2023-01-15'),
};

// Organizations
export const organizations: Organization[] = [
  {
    id: 'org-001',
    name: 'اسطبل الفروسية الملكي',
    type: 'stable',
    logo: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop',
    address: 'الرياض، حي الملقا',
    phone: '+966 11 234 5678',
    email: 'info@royalstable.sa',
    ownerId: 'owner-001',
  },
  {
    id: 'org-002',
    name: 'عيادة الصحراء البيطرية',
    type: 'clinic',
    logo: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=100&h=100&fit=crop',
    address: 'جدة، حي الروضة',
    phone: '+966 12 345 6789',
    email: 'contact@desertclinic.sa',
    ownerId: 'owner-002',
  },
  {
    id: 'org-003',
    name: 'مختبر الخليج للتحاليل',
    type: 'lab',
    logo: 'https://images.unsplash.com/photo-1579165466741-7f35e4755169?w=100&h=100&fit=crop',
    address: 'الدمام، حي الفيصلية',
    phone: '+966 13 456 7890',
    email: 'lab@gulflab.sa',
    ownerId: 'owner-003',
  },
  {
    id: 'org-004',
    name: 'اسطبل النجوم',
    type: 'stable',
    logo: 'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=100&h=100&fit=crop',
    address: 'الرياض، حي العليا',
    phone: '+966 11 567 8901',
    email: 'stars@stablestars.sa',
    ownerId: 'owner-004',
  },
];

// Memberships
export const memberships: OrganizationMembership[] = [
  {
    id: 'mem-001',
    userId: 'vet-001',
    organizationId: 'org-001',
    employmentType: 'employee',
    startDate: new Date('2023-06-01'),
    isActive: true,
    organization: organizations[0],
  },
  {
    id: 'mem-002',
    userId: 'vet-001',
    organizationId: 'org-002',
    employmentType: 'freelancer',
    startDate: new Date('2024-01-15'),
    isActive: true,
    organization: organizations[1],
  },
  {
    id: 'mem-003',
    userId: 'vet-001',
    organizationId: 'org-004',
    employmentType: 'freelancer',
    startDate: new Date('2024-03-01'),
    isActive: true,
    organization: organizations[3],
  },
];

// Horses
export const horses: Horse[] = [
  {
    id: 'horse-001',
    name: 'البرق',
    breed: 'عربي أصيل',
    age: 5,
    color: 'أبيض',
    gender: 'male',
    microchipId: 'MC-2024-001',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=300&h=300&fit=crop',
    organizationId: 'org-001',
    organization: organizations[0],
  },
  {
    id: 'horse-002',
    name: 'الريح',
    breed: 'عربي أصيل',
    age: 7,
    color: 'بني',
    gender: 'male',
    microchipId: 'MC-2024-002',
    image: 'https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?w=300&h=300&fit=crop',
    organizationId: 'org-001',
    organization: organizations[0],
  },
  {
    id: 'horse-003',
    name: 'الأميرة',
    breed: 'أندلسي',
    age: 4,
    color: 'أسود',
    gender: 'female',
    microchipId: 'MC-2024-003',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    organizationId: 'org-004',
    organization: organizations[3],
  },
  {
    id: 'horse-004',
    name: 'الصقر',
    breed: 'عربي أصيل',
    age: 6,
    color: 'رمادي',
    gender: 'male',
    microchipId: 'MC-2024-004',
    image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=300&h=300&fit=crop',
    organizationId: 'org-004',
    organization: organizations[3],
  },
];

// Horse Access
export const horseAccess: HorseAccess[] = [
  {
    id: 'access-001',
    horseId: 'horse-001',
    vetId: 'vet-001',
    accessLevel: 'full',
    grantedBy: 'owner-001',
    grantedAt: new Date('2024-01-01'),
    horse: horses[0],
  },
  {
    id: 'access-002',
    horseId: 'horse-002',
    vetId: 'vet-001',
    accessLevel: 'edit',
    grantedBy: 'owner-001',
    grantedAt: new Date('2024-01-01'),
    horse: horses[1],
  },
  {
    id: 'access-003',
    horseId: 'horse-003',
    vetId: 'vet-001',
    accessLevel: 'view',
    grantedBy: 'owner-004',
    grantedAt: new Date('2024-03-01'),
    horse: horses[2],
  },
  {
    id: 'access-004',
    horseId: 'horse-004',
    vetId: 'vet-001',
    accessLevel: 'full',
    grantedBy: 'owner-004',
    grantedAt: new Date('2024-03-15'),
    horse: horses[3],
  },
];

// Appointments
export const appointments: Appointment[] = [
  {
    id: 'apt-001',
    horseId: 'horse-001',
    vetId: 'vet-001',
    organizationId: 'org-001',
    title: 'فحص دوري',
    description: 'فحص صحي شامل',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    status: 'scheduled',
    location: 'اسطبل الفروسية الملكي',
    horse: horses[0],
    organization: organizations[0],
  },
  {
    id: 'apt-002',
    horseId: 'horse-002',
    vetId: 'vet-001',
    organizationId: 'org-001',
    title: 'تطعيم سنوي',
    description: 'تطعيمات الخيول السنوية',
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 30,
    status: 'scheduled',
    location: 'اسطبل الفروسية الملكي',
    horse: horses[1],
    organization: organizations[0],
  },
  {
    id: 'apt-003',
    horseId: 'horse-003',
    vetId: 'vet-001',
    organizationId: 'org-004',
    title: 'متابعة علاجية',
    description: 'متابعة حالة الساق',
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    duration: 45,
    status: 'scheduled',
    location: 'اسطبل النجوم',
    horse: horses[2],
    organization: organizations[3],
  },
  {
    id: 'apt-004',
    horseId: 'horse-004',
    vetId: 'vet-001',
    organizationId: 'org-004',
    title: 'فحص أسنان',
    description: 'فحص وتنظيف الأسنان',
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    duration: 60,
    status: 'completed',
    location: 'اسطبل النجوم',
    horse: horses[3],
    organization: organizations[3],
  },
];

// Medical Records
export const medicalRecords: MedicalRecord[] = [
  {
    id: 'rec-001',
    horseId: 'horse-001',
    vetId: 'vet-001',
    date: new Date('2024-11-01'),
    type: 'checkup',
    diagnosis: 'حالة صحية ممتازة',
    treatment: 'لا يحتاج علاج',
    notes: 'الحصان بصحة جيدة، يُنصح بالاستمرار على نظام التغذية الحالي',
    horse: horses[0],
  },
  {
    id: 'rec-002',
    horseId: 'horse-002',
    vetId: 'vet-001',
    date: new Date('2024-10-15'),
    type: 'vaccination',
    treatment: 'تطعيم ضد الأنفلونزا',
    medications: [
      {
        name: 'لقاح الأنفلونزا',
        dosage: '1ml',
        frequency: 'جرعة واحدة',
        duration: '-',
      },
    ],
    notes: 'التطعيم تم بنجاح، الجرعة التالية بعد 6 أشهر',
    horse: horses[1],
  },
  {
    id: 'rec-003',
    horseId: 'horse-003',
    vetId: 'vet-001',
    date: new Date('2024-11-10'),
    type: 'treatment',
    diagnosis: 'التهاب خفيف في الساق اليمنى',
    treatment: 'كمادات باردة ومضاد للالتهاب',
    medications: [
      {
        name: 'فينيل بوتازون',
        dosage: '2g',
        frequency: 'مرتين يومياً',
        duration: '5 أيام',
        instructions: 'يُعطى مع الطعام',
      },
    ],
    notes: 'يحتاج راحة لمدة أسبوع',
    horse: horses[2],
  },
];

// Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'vet-001',
    title: 'موعد قادم',
    message: 'لديك موعد فحص دوري للحصان "البرق" خلال ساعتين',
    type: 'appointment',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'notif-002',
    userId: 'vet-001',
    title: 'صلاحية جديدة',
    message: 'تم منحك صلاحية الوصول للحصان "الصقر" من اسطبل النجوم',
    type: 'access_granted',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'notif-003',
    userId: 'vet-001',
    title: 'رسالة جديدة',
    message: 'لديك رسالة جديدة من اسطبل الفروسية الملكي',
    type: 'message',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'notif-004',
    userId: 'vet-001',
    title: 'تذكير',
    message: 'تذكير: موعد تطعيم الحصان "الريح" غداً',
    type: 'reminder',
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

// Conversations
export const conversations: Conversation[] = [
  {
    id: 'conv-001',
    participantIds: ['vet-001', 'owner-001'],
    lastMessage: {
      id: 'msg-001',
      senderId: 'owner-001',
      receiverId: 'vet-001',
      content: 'شكراً دكتور على الفحص، متى موعد المتابعة؟',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
    },
    organization: organizations[0],
    unreadCount: 1,
  },
  {
    id: 'conv-002',
    participantIds: ['vet-001', 'owner-004'],
    lastMessage: {
      id: 'msg-002',
      senderId: 'vet-001',
      receiverId: 'owner-004',
      content: 'الحصان "الأميرة" تحسنت حالتها بشكل ملحوظ',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
    },
    organization: organizations[3],
    unreadCount: 0,
  },
  {
    id: 'conv-003',
    participantIds: ['vet-001', 'owner-002'],
    lastMessage: {
      id: 'msg-003',
      senderId: 'owner-002',
      receiverId: 'vet-001',
      content: 'هل يمكنك الحضور للعيادة غداً صباحاً؟',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: true,
    },
    organization: organizations[1],
    unreadCount: 0,
  },
];
