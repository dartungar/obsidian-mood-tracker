function createMomentLike(date?: any) {
    const d = date ? new Date(date) : new Date();
    return {
        format: (fmt: string) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const hours12 = String(d.getHours() % 12 || 12);
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
            const monthLong = d.toLocaleDateString('en', { month: 'long' });
            const dayNum = String(d.getDate());

            // Token-based replacement: replace longest tokens first to avoid
            // substring collisions (e.g., MMMM before MM, DD before D, HH before h)
            const tokens: Record<string, string> = {
                'YYYY': String(year),
                'MMMM': monthLong,
                'MM': month,
                'DD': day,
                'HH': hours,
                'mm': minutes,
                'A': ampm,
            };

            // Build regex from token keys sorted by length (longest first)
            const tokenPattern = new RegExp(
                Object.keys(tokens).sort((a, b) => b.length - a.length).join('|'),
                'g'
            );

            let result = fmt.replace(tokenPattern, (match) => tokens[match]);
            // Handle single-char tokens that could collide with text:
            // 'D' (unpadded day) - only match standalone D not preceded/followed by letter
            result = result.replace(/(?<![A-Za-z])D(?![A-Za-z])/g, dayNum);
            // 'h' (12-hour) - only match standalone h not preceded/followed by letter
            result = result.replace(/(?<![A-Za-z])h(?![A-Za-z])/g, hours12);

            return result;
        },
        toDate: () => d
    };
}

// Create a callable moment mock that also has a locale() method
let currentLocale = 'ja';
const momentMock = Object.assign(
    (date?: any) => createMomentLike(date),
    {
        locale: (...args: any[]) => {
            if (args.length > 0) {
                currentLocale = args[0];
                return currentLocale;
            }
            return currentLocale;
        },
        _resetLocale: () => { currentLocale = 'ja'; }
    }
);

// Mock window.moment for testing
(global as any).window = {
    moment: momentMock
};
