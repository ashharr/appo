# Appo Mobile Application - Low-Level Design

## 1. Mobile Architecture Overview

### 1.1 React Native Architecture Diagram

```mermaid
graph TB
    subgraph "React Native Application"
        A[App.tsx] --> B[Navigation Container]
        A --> C[Redux Provider]
        A --> D[Theme Provider]
        A --> E[Error Boundary]
        
        B --> F[Authentication Stack]
        B --> G[Main Tab Navigator]
        B --> H[Modal Stack]
        
        C --> I[Auth Slice]
        C --> J[Appointment Slice]
        C --> K[Business Slice]
        C --> L[UI Slice]
        
        M[Persistence Layer] --> C
        N[AsyncStorage] --> M
        O[SecureStorage] --> M
    end
    
    subgraph "Native Layer"
        P[iOS Native Modules]
        Q[Android Native Modules]
        R[Device APIs]
        S[Platform Services]
    end
    
    subgraph "External Services"
        T[REST APIs]
        U[Push Notifications]
        V[Analytics]
        W[Crash Reporting]
    end
    
    A --> P
    A --> Q
    R --> P
    R --> Q
    
    I --> T
    J --> T
    K --> T
    L --> V
    E --> W
```

### 1.2 Component Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Screen
    participant C as Component
    participant H as Hook
    participant R as Redux Store
    participant API as API Service
    participant N as Native Module
    
    U->>S: Touch Interaction
    S->>C: Trigger Component
    C->>H: Call Custom Hook
    H->>R: Dispatch Action
    R->>API: HTTP Request
    API->>R: Response Data
    R->>H: State Update
    H->>C: Re-render
    C->>N: Native Interaction
    N->>C: Native Callback
    C->>S: Update UI
    S->>U: Visual Feedback
```

### 1.3 Navigation Architecture

```mermaid
graph TD
    subgraph "Navigation Structure"
        A[Root Navigator] --> B[Auth Stack]
        A --> C[Main Stack]
        
        B --> D[Welcome Screen]
        B --> E[Login Screen]
        B --> F[Register Screen]
        B --> G[Forgot Password]
        
        C --> H[Customer Tab Navigator]
        C --> I[Business Tab Navigator]
        C --> J[Modal Screens]
        
        H --> K[Home Stack]
        H --> L[Search Stack]
        H --> M[Appointments Stack]
        H --> N[Profile Stack]
        
        I --> O[Schedule Stack]
        I --> P[Customers Stack]
        I --> Q[Services Stack]
        I --> R[Analytics Stack]
    end
    
    subgraph "Screen Components"
        S[HomeScreen]
        T[AppointmentListScreen]
        U[BookingScreen]
        V[ProfileScreen]
        W[BusinessDashboard]
        X[CustomerCheckIn]
    end
    
    K --> S
    M --> T
    M --> U
    N --> V
    O --> W
    P --> X
```

## 2. Detailed Component Architecture

### 2.1 Screen Component Structure

```mermaid
graph TD
    subgraph "Screen Components"
        A[BaseScreen] --> B[CustomerScreens]
        A --> C[BusinessScreens]
        A --> D[SharedScreens]
        
        B --> E[HomeScreen]
        B --> F[SearchScreen]
        B --> G[AppointmentScreen]
        B --> H[ProfileScreen]
        
        C --> I[DashboardScreen]
        C --> J[ScheduleScreen]
        C --> K[CustomerManageScreen]
        C --> L[ServiceScreen]
        
        D --> M[LoginScreen]
        D --> N[OnboardingScreen]
        D --> O[SettingsScreen]
    end
    
    subgraph "Reusable Components"
        P[AppButton]
        Q[AppInput]
        R[AppCard]
        S[AppModal]
        T[AppDatePicker]
        U[AppCamera]
        V[AppMap]
    end
    
    E --> P
    E --> Q
    F --> R
    G --> S
    H --> T
    I --> U
    J --> V
```

### 2.2 Component Specifications

#### 2.2.1 Authentication Components

**LoginScreen**
```tsx
interface LoginScreenProps {
  navigation: NavigationProp<AuthStackParamList, 'Login'>;
  route: RouteProp<AuthStackParamList, 'Login'>;
}

interface LoginFormData {
  email: string;
  password: string;
  userType: UserType;
  rememberMe: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<LoginFormData>();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { login, loading, error } = useAuth();
  
  const handleBiometricLogin = async () => {
    // Biometric authentication logic
  };
  
  const handleFormLogin = async (data: LoginFormData) => {
    await login(data);
  };
};
```

**BiometricAuth Component**
```tsx
interface BiometricAuthProps {
  onSuccess: (credentials: StoredCredentials) => void;
  onError: (error: string) => void;
  fallbackToPassword: () => void;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onError,
  fallbackToPassword
}) => {
  const [biometricType, setBiometricType] = useState<BiometricType>();
  
  useEffect(() => {
    checkBiometricSupport();
  }, []);
  
  const authenticateWithBiometric = async () => {
    // Platform-specific biometric authentication
  };
};
```

#### 2.2.2 Booking Components

**AppointmentBooking**
```tsx
interface AppointmentBookingProps {
  businessCenterId: string;
  selectedService?: Service;
  onBookingComplete: (appointment: Appointment) => void;
}

interface BookingState {
  step: BookingStep;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: TimeSlot | null;
  customerInfo: CustomerInfo;
  paymentMethod: PaymentMethod | null;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  businessCenterId,
  selectedService,
  onBookingComplete
}) => {
  const [bookingState, setBookingState] = useState<BookingState>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  
  const { createAppointment, loading } = useAppointments();
  const { location } = useLocation();
};
```

**TimeSlotPicker**
```tsx
interface TimeSlotPickerProps {
  availableSlots: TimeSlot[];
  selectedDate: Date;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  availableSlots,
  selectedDate,
  onSlotSelect,
  selectedSlot
}) => {
  const [displayedSlots, setDisplayedSlots] = useState<TimeSlot[]>([]);
  
  const renderTimeSlot = ({ item }: { item: TimeSlot }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        selectedSlot?.id === item.id && styles.selectedSlot
      ]}
      onPress={() => onSlotSelect(item)}
    >
      <Text style={styles.timeText}>{formatTime(item.startTime)}</Text>
    </TouchableOpacity>
  );
};
```

#### 2.2.3 Location-Based Components

**NearbyBusinesses**
```tsx
interface NearbyBusinessesProps {
  userLocation: Location;
  searchRadius: number;
  serviceCategory?: string;
  onBusinessSelect: (business: BusinessCenter) => void;
}

const NearbyBusinesses: React.FC<NearbyBusinessesProps> = ({
  userLocation,
  searchRadius,
  serviceCategory,
  onBusinessSelect
}) => {
  const [businesses, setBusinesses] = useState<BusinessCenter[]>([]);
  const [mapRegion, setMapRegion] = useState<Region>();
  
  const { getBusinessesByLocation } = useBusinessCenters();
  
  useEffect(() => {
    loadNearbyBusinesses();
  }, [userLocation, searchRadius, serviceCategory]);
};
```

## 3. State Management Architecture

### 3.1 Redux Store Structure with Persistence

```mermaid
graph TD
    subgraph "Redux Store"
        A[Root Reducer] --> B[Auth Slice]
        A --> C[Appointments Slice]
        A --> D[Business Centers Slice]
        A --> E[Services Slice]
        A --> F[Location Slice]
        A --> G[Notifications Slice]
        A --> H[Offline Slice]
        A --> I[UI Slice]
    end
    
    subgraph "Persistence Layer"
        J[Redux Persist] --> K[AsyncStorage]
        J --> L[SecureStorage]
        J --> M[FlipperStorage]
        
        B --> L
        C --> K
        D --> K
        E --> K
        F --> K
        G --> K
        H --> K
        I --> K
    end
    
    subgraph "Middleware"
        N[RTK Query]
        O[Offline Middleware]
        P[Analytics Middleware]
        Q[Error Tracking]
    end
    
    A --> N
    A --> O
    A --> P
    A --> Q
```

### 3.2 Mobile-Specific State Slices

**locationSlice.ts**
```typescript
interface LocationState {
  currentLocation: Location | null;
  permissionStatus: PermissionStatus;
  trackingEnabled: boolean;
  nearbyBusinesses: BusinessCenter[];
  loading: boolean;
  error: string | null;
}

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setPermissionStatus: (state, action) => {
      state.permissionStatus = action.payload;
    },
    toggleTracking: (state) => {
      state.trackingEnabled = !state.trackingEnabled;
    },
    setNearbyBusinesses: (state, action) => {
      state.nearbyBusinesses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentLocation.fulfilled, (state, action) => {
        state.currentLocation = action.payload;
        state.loading = false;
      });
  },
});
```

**offlineSlice.ts**
```typescript
interface OfflineState {
  isConnected: boolean;
  queuedActions: QueuedAction[];
  syncInProgress: boolean;
  lastSyncTime: Date | null;
  cachedData: CachedData;
}

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    queueAction: (state, action) => {
      state.queuedActions.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
        id: generateId(),
      });
    },
    removeQueuedAction: (state, action) => {
      state.queuedActions = state.queuedActions.filter(
        action => action.id !== action.payload
      );
    },
    startSync: (state) => {
      state.syncInProgress = true;
    },
    completeSync: (state) => {
      state.syncInProgress = false;
      state.lastSyncTime = new Date();
      state.queuedActions = [];
    },
  },
});
```

### 3.3 Offline Data Synchronization Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant O as Offline Store
    participant N as Network
    participant S as Server
    
    U->>A: Perform Action
    A->>N: Check Connectivity
    
    alt Online
        A->>S: Send Request
        S->>A: Response
        A->>O: Cache Response
        A->>U: Show Result
    else Offline
        A->>O: Queue Action
        A->>U: Show Offline Message
    end
    
    Note over A,O: When connectivity restored
    A->>N: Detect Connection
    A->>O: Get Queued Actions
    O->>A: Return Actions
    
    loop For each queued action
        A->>S: Execute Action
        S->>A: Response
        A->>O: Remove from Queue
    end
    
    A->>U: Sync Complete
```

## 4. Native Module Integration

### 4.1 Device Services Architecture

```mermaid
graph TD
    subgraph "React Native Layer"
        A[JavaScript Code] --> B[Native Bridge]
        B --> C[Native Modules]
    end
    
    subgraph "iOS Native Modules"
        D[BiometricModule.ios.ts] --> E[Touch ID / Face ID]
        F[CameraModule.ios.ts] --> G[iOS Camera]
        H[LocationModule.ios.ts] --> I[Core Location]
        J[CalendarModule.ios.ts] --> K[EventKit]
        L[PaymentModule.ios.ts] --> M[Apple Pay]
    end
    
    subgraph "Android Native Modules"
        N[BiometricModule.android.ts] --> O[Fingerprint API]
        P[CameraModule.android.ts] --> Q[Camera2 API]
        R[LocationModule.android.ts] --> S[Location Services]
        T[CalendarModule.android.ts] --> U[Calendar Provider]
        V[PaymentModule.android.ts] --> W[Google Pay]
    end
    
    C --> D
    C --> F
    C --> H
    C --> J
    C --> L
    
    C --> N
    C --> P
    C --> R
    C --> T
    C --> V
```

### 4.2 Native Module Implementations

**BiometricModule**
```typescript
// BiometricModule.ts
interface BiometricOptions {
  title: string;
  subtitle?: string;
  description?: string;
  fallbackLabel?: string;
  negativeLabel?: string;
}

interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: 'TouchID' | 'FaceID' | 'Fingerprint';
}

class BiometricModule {
  static async isAvailable(): Promise<boolean> {
    return NativeBiometric.isAvailable();
  }
  
  static async getSupportedBiometryType(): Promise<string | null> {
    return NativeBiometric.getBiometryType();
  }
  
  static async authenticate(options: BiometricOptions): Promise<BiometricResult> {
    try {
      await NativeBiometric.requestBioAuth(options);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

**CameraModule**
```typescript
// CameraModule.ts
interface CameraOptions {
  mediaType: 'photo' | 'video';
  quality: 'high' | 'medium' | 'low';
  allowsEditing: boolean;
  aspect?: [number, number];
  maxWidth?: number;
  maxHeight?: number;
}

interface CameraResult {
  uri: string;
  width: number;
  height: number;
  fileSize: number;
  type: string;
  fileName: string;
}

class CameraModule {
  static async requestPermissions(): Promise<boolean> {
    const result = await request(PERMISSIONS.IOS.CAMERA);
    return result === RESULTS.GRANTED;
  }
  
  static async captureImage(options: CameraOptions): Promise<CameraResult> {
    return new Promise((resolve, reject) => {
      ImagePicker.launchCamera(options, (response) => {
        if (response.didCancel || response.errorMessage) {
          reject(new Error(response.errorMessage || 'Cancelled'));
        } else {
          resolve(response.assets[0]);
        }
      });
    });
  }
  
  static async selectFromGallery(options: CameraOptions): Promise<CameraResult> {
    return new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel || response.errorMessage) {
          reject(new Error(response.errorMessage || 'Cancelled'));
        } else {
          resolve(response.assets[0]);
        }
      });
    });
  }
}
```

## 5. Custom Hooks Architecture

### 5.1 Mobile-Specific Hooks

```mermaid
graph TD
    subgraph "Device Hooks"
        A[useLocation] --> B[GPS Tracking]
        C[useCamera] --> D[Image Capture]
        E[useBiometric] --> F[Authentication]
        G[useNetworkStatus] --> H[Connectivity]
        I[useDeviceInfo] --> J[Device Details]
    end
    
    subgraph "App Hooks"
        K[useOfflineSync] --> L[Data Sync]
        M[useNotifications] --> N[Push Notifications]
        O[useAppState] --> P[Background/Foreground]
        Q[usePermissions] --> R[Permission Management]
    end
    
    subgraph "Business Hooks"
        S[useAppointments] --> T[Appointment Management]
        U[useBusinessCenters] --> V[Business Data]
        W[useServices] --> X[Service Management]
        Y[useAuth] --> Z[Authentication State]
    end
    
    A --> K
    C --> S
    E --> Y
    G --> K
    M --> S
```

### 5.2 Hook Implementations

**useLocation Hook**
```typescript
interface LocationHook {
  location: Location | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location>;
  watchPosition: (callback: (location: Location) => void) => number;
  clearWatch: (watchId: number) => void;
}

const useLocation = (): LocationHook => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await request(
        Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );
      return result === RESULTS.GRANTED;
    } catch (err) {
      setError('Permission request failed');
      return false;
    }
  }, []);
  
  const getCurrentLocation = useCallback(async (): Promise<Location> => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          setLocation(loc);
          setLoading(false);
          resolve(loc);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }, []);
  
  return {
    location,
    loading,
    error,
    requestPermission,
    getCurrentLocation,
    watchPosition: Geolocation.watchPosition,
    clearWatch: Geolocation.clearWatch,
  };
};
```

**useOfflineSync Hook**
```typescript
interface OfflineSyncHook {
  isOnline: boolean;
  queuedActions: QueuedAction[];
  syncInProgress: boolean;
  queueAction: (action: Action) => void;
  executeQueuedActions: () => Promise<void>;
  clearQueue: () => void;
}

const useOfflineSync = (): OfflineSyncHook => {
  const dispatch = useAppDispatch();
  const { isConnected, queuedActions, syncInProgress } = useAppSelector(
    state => state.offline
  );
  
  const [isOnline, setIsOnline] = useState(isConnected);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);
      dispatch(setConnectionStatus(online));
      
      if (online && queuedActions.length > 0) {
        executeQueuedActions();
      }
    });
    
    return unsubscribe;
  }, []);
  
  const queueAction = useCallback((action: Action) => {
    if (!isOnline) {
      dispatch(queueAction(action));
    }
  }, [isOnline, dispatch]);
  
  const executeQueuedActions = useCallback(async () => {
    if (syncInProgress || queuedActions.length === 0) return;
    
    dispatch(startSync());
    
    try {
      for (const queuedAction of queuedActions) {
        await dispatch(queuedAction.action);
        dispatch(removeQueuedAction(queuedAction.id));
      }
      dispatch(completeSync());
    } catch (error) {
      console.error('Sync failed:', error);
      dispatch(completeSync());
    }
  }, [queuedActions, syncInProgress, dispatch]);
  
  return {
    isOnline,
    queuedActions,
    syncInProgress,
    queueAction,
    executeQueuedActions,
    clearQueue: () => dispatch(clearQueue()),
  };
};
```

## 6. Navigation Implementation

### 6.1 Navigation Structure

```mermaid
stateDiagram-v2
    [*] --> AppLoading
    AppLoading --> Authentication: Check Auth
    Authentication --> OnboardingStack: New User
    Authentication --> MainStack: Authenticated
    
    OnboardingStack --> WelcomeScreen
    WelcomeScreen --> PermissionScreen
    PermissionScreen --> ProfileSetup
    ProfileSetup --> MainStack
    
    MainStack --> CustomerTabs: Customer Role
    MainStack --> BusinessTabs: Business Role
    
    state CustomerTabs {
        [*] --> HomeTab
        HomeTab --> SearchTab
        SearchTab --> AppointmentsTab
        AppointmentsTab --> ProfileTab
        ProfileTab --> HomeTab
    }
    
    state BusinessTabs {
        [*] --> DashboardTab
        DashboardTab --> ScheduleTab
        ScheduleTab --> CustomersTab
        CustomersTab --> ServicesTab
        ServicesTab --> DashboardTab
    }
    
    CustomerTabs --> BookingModal: Book Appointment
    BusinessTabs --> CustomerDetailModal: View Customer
    
    BookingModal --> CustomerTabs: Complete/Cancel
    CustomerDetailModal --> BusinessTabs: Close
```

### 6.2 Navigation Configuration

**RootNavigator.tsx**
```tsx
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
  Modal: { screen: string; params?: any };
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isFirstTime } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    checkAuthState();
  }, []);
  
  const checkAuthState = async () => {
    try {
      // Check stored auth token
      // Verify token with server
      // Set authentication state
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : isFirstTime ? (
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <RootStack.Screen name="Main" component={MainNavigator} />
        )}
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
          <RootStack.Screen name="Modal" component={ModalNavigator} />
        </RootStack.Group>
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
```

**CustomerTabNavigator.tsx**
```tsx
type CustomerTabParamList = {
  Home: undefined;
  Search: { category?: string };
  Appointments: undefined;
  Profile: undefined;
};

const CustomerTab = createBottomTabNavigator<CustomerTabParamList>();

const CustomerTabNavigator: React.FC = () => {
  const theme = useTheme();
  const { hasNotifications } = useNotifications();
  
  return (
    <CustomerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIcon(route.name, focused);
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <CustomerTab.Screen 
        name="Home" 
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Home' }}
      />
      <CustomerTab.Screen 
        name="Search" 
        component={SearchStackNavigator}
        options={{ tabBarLabel: 'Search' }}
      />
      <CustomerTab.Screen 
        name="Appointments" 
        component={AppointmentsStackNavigator}
        options={{ 
          tabBarLabel: 'Appointments',
          tabBarBadge: hasNotifications ? '!' : undefined,
        }}
      />
      <CustomerTab.Screen 
        name="Profile" 
        component={ProfileStackNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
    </CustomerTab.Navigator>
  );
};
```

## 7. Performance Optimization

### 7.1 React Native Performance Strategy

```mermaid
graph TD
    subgraph "Rendering Optimization"
        A[FlatList Optimization] --> B[getItemLayout]
        A --> C[keyExtractor]
        A --> D[removeClippedSubviews]
        
        E[Image Optimization] --> F[Lazy Loading]
        E --> G[Caching Strategy]
        E --> H[Format Optimization]
        
        I[Animation Performance] --> J[Native Driver]
        I --> K[Interaction Manager]
        I --> L[Layout Animation]
    end
    
    subgraph "Memory Management"
        M[Component Optimization] --> N[React.memo]
        M --> O[useCallback]
        M --> P[useMemo]
        
        Q[State Management] --> R[Normalized State]
        Q --> S[Selective Updates]
        Q --> T[Cleanup Effects]
    end
    
    subgraph "Bundle Optimization"
        U[Code Splitting] --> V[Screen Lazy Loading]
        U --> W[Library Splitting]
        U --> X[Platform Splitting]
        
        Y[Asset Optimization] --> Z[Image Compression]
        Y --> AA[Font Subsetting]
        Y --> BB[Vector Icons]
    end
```

### 7.2 List Performance Implementation

**OptimizedAppointmentList**
```tsx
interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentPress: (appointment: Appointment) => void;
  onRefresh: () => void;
  loading: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = React.memo(({
  appointments,
  onAppointmentPress,
  onRefresh,
  loading
}) => {
  const [refreshing, setRefreshing] = useState(false);
  
  const keyExtractor = useCallback(
    (item: Appointment) => item.id,
    []
  );
  
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: APPOINTMENT_ITEM_HEIGHT,
      offset: APPOINTMENT_ITEM_HEIGHT * index,
      index,
    }),
    []
  );
  
  const renderAppointment = useCallback(
    ({ item }: { item: Appointment }) => (
      <AppointmentItem
        appointment={item}
        onPress={onAppointmentPress}
      />
    ),
    [onAppointmentPress]
  );
  
  const onRefreshList = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);
  
  return (
    <FlatList
      data={appointments}
      renderItem={renderAppointment}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshList}
          tintColor={colors.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
});
```

### 7.3 Image Optimization

**OptimizedImage Component**
```tsx
interface OptimizedImageProps {
  source: ImageSource;
  style?: StyleProp<ImageStyle>;
  placeholder?: string;
  resizeMode?: ImageResizeMode;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  placeholder,
  resizeMode = 'cover',
  onLoad,
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const handleLoad = useCallback(() => {
    setLoading(false);
    onLoad?.();
  }, [onLoad]);
  
  const handleError = useCallback((err: any) => {
    setLoading(false);
    setError(true);
    onError?.(err);
  }, [onError]);
  
  if (error && placeholder) {
    return (
      <Image
        source={{ uri: placeholder }}
        style={style}
        resizeMode={resizeMode}
      />
    );
  }
  
  return (
    <View style={style}>
      {loading && placeholder && (
        <Image
          source={{ uri: placeholder }}
          style={[StyleSheet.absoluteFillObject, { opacity: 0.3 }]}
          resizeMode={resizeMode}
        />
      )}
      <FastImage
        source={source}
        style={StyleSheet.absoluteFillObject}
        resizeMode={FastImage.resizeMode[resizeMode]}
        onLoad={handleLoad}
        onError={handleError}
      />
      {loading && (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
};
```

## 8. Testing Architecture

### 8.1 Mobile Testing Strategy

```mermaid
graph TD
    subgraph "Testing Pyramid"
        A[Unit Tests - 70%] --> B[Component Tests]
        A --> C[Hook Tests]
        A --> D[Utility Tests]
        
        E[Integration Tests - 20%] --> F[Navigation Tests]
        E --> G[API Integration]
        E --> H[State Management]
        
        I[E2E Tests - 10%] --> J[Critical User Flows]
        I --> K[Cross-Platform Tests]
        I --> L[Device Feature Tests]
    end
    
    subgraph "Testing Tools"
        M[Jest] --> N[Unit Testing]
        O[React Native Testing Library] --> P[Component Testing]
        Q[Detox] --> R[E2E Testing]
        S[Flipper] --> T[Debug & Profiling]
        U[Reactotron] --> V[State Inspection]
    end
    
    subgraph "Platform Testing"
        W[iOS Simulator] --> X[iOS Testing]
        Y[Android Emulator] --> Z[Android Testing]
        AA[Physical Devices] --> BB[Real Device Testing]
    end
```

### 8.2 Component Testing Implementation

**AppointmentCard.test.tsx**
```tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AppointmentCard } from '../AppointmentCard';
import { mockAppointment } from '../../__mocks__/appointments';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={mockStore}>
    <ThemeProvider theme={lightTheme}>
      {children}
    </ThemeProvider>
  </Provider>
);

describe('AppointmentCard', () => {
  const mockOnPress = jest.fn();
  const mockOnCancel = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders appointment information correctly', () => {
    const { getByText, getByTestId } = render(
      <TestWrapper>
        <AppointmentCard
          appointment={mockAppointment}
          onPress={mockOnPress}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    );
    
    expect(getByText(mockAppointment.serviceName)).toBeTruthy();
    expect(getByText(mockAppointment.businessName)).toBeTruthy();
    expect(getByTestId('appointment-date')).toBeTruthy();
  });
  
  it('calls onPress when card is tapped', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <AppointmentCard
          appointment={mockAppointment}
          onPress={mockOnPress}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    );
    
    fireEvent.press(getByTestId('appointment-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockAppointment);
  });
  
  it('shows cancel option for upcoming appointments', async () => {
    const upcomingAppointment = {
      ...mockAppointment,
      status: 'confirmed',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    };
    
    const { getByTestId } = render(
      <TestWrapper>
        <AppointmentCard
          appointment={upcomingAppointment}
          onPress={mockOnPress}
          onCancel={mockOnCancel}
        />
      </TestWrapper>
    );
    
    const cancelButton = getByTestId('cancel-appointment');
    expect(cancelButton).toBeTruthy();
    
    fireEvent.press(cancelButton);
    
    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalledWith(upcomingAppointment.id);
    });
  });
});
```

### 8.3 E2E Testing with Detox

**appointmentBooking.e2e.js**
```javascript
describe('Appointment Booking Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  beforeEach(async () => {
    await device.reloadReactNative();
  });
  
  it('should complete appointment booking flow', async () => {
    // Navigate to search
    await element(by.id('search-tab')).tap();
    
    // Search for business
    await element(by.id('search-input')).typeText('Hair Salon');
    await element(by.id('search-button')).tap();
    
    // Select business
    await waitFor(element(by.id('business-card-0')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('business-card-0')).tap();
    
    // Select service
    await element(by.id('service-item-0')).tap();
    await element(by.id('book-service-button')).tap();
    
    // Select date and time
    await element(by.id('date-picker')).tap();
    await element(by.text('Tomorrow')).tap();
    await element(by.id('time-slot-0')).tap();
    
    // Confirm booking
    await element(by.id('confirm-booking')).tap();
    
    // Verify booking success
    await waitFor(element(by.text('Booking Confirmed')))
      .toBeVisible()
      .withTimeout(3000);
    
    await element(by.text('OK')).tap();
    
    // Verify appointment appears in appointments tab
    await element(by.id('appointments-tab')).tap();
    await expect(element(by.id('appointment-item-0'))).toBeVisible();
  });
  
  it('should handle offline booking', async () => {
    // Simulate offline mode
    await device.setURLBlacklist(['*']);
    
    // Attempt to book appointment
    await element(by.id('search-tab')).tap();
    await element(by.id('search-input')).typeText('Hair Salon');
    await element(by.id('search-button')).tap();
    
    // Should show offline message
    await expect(element(by.text('You are offline'))).toBeVisible();
    
    // Re-enable network
    await device.setURLBlacklist([]);
    
    // Should automatically retry
    await waitFor(element(by.id('business-card-0')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
```

## 9. Build and Deployment

### 9.1 Build Configuration

**metro.config.js**
```javascript
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
    serializer: {
      getModulesRunBeforeMainModule: () => [
        require.resolve('react-native/Libraries/Core/InitializeCore'),
      ],
    },
  };
})();
```

**react-native.config.js**
```javascript
module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          sourceDir: '../node_modules/react-native-vector-icons/Fonts',
          fonts: ['*.ttf'],
        },
        android: {
          sourceDir: '../node_modules/react-native-vector-icons/Fonts',
          fonts: ['*.ttf'],
        },
      },
    },
  },
  assets: ['./src/assets/fonts/'],
};
```

This comprehensive low-level design provides detailed technical specifications for implementing the React Native mobile application with modern patterns, optimal performance, and robust architecture. 