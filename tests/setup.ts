function createMomentLike(date?: any) {
    const d = date ? new Date(date) : new Date();
    return {
        format: (fmt: string) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');

            return fmt
                .replace('YYYY', String(year))
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('MMMM', d.toLocaleDateString('en', { month: 'long' }))
                .replace(/(?<!\d)D(?!\d)/, String(d.getDate()))
                .replace('h', String(d.getHours() % 12 || 12))
                .replace('A', d.getHours() >= 12 ? 'PM' : 'AM');
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
        }
    }
);

// Mock window.moment for testing
(global as any).window = {
    moment: momentMock
};
