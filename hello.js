class RealEstateListings {
    constructor(properties = []) {
        this.properties = properties;
    }

    calculateAveragePrice() {
        if (this.properties.length === 0) return 0;
        const totalPrice = this.properties.reduce((acc, property) => acc + property.price, 0);
        return totalPrice / this.properties.length;
    }

    filterByType(type) {
        return this.properties.filter(property => property.type.toLowerCase() === type.toLowerCase());
    }

    largestPropertyBySize() {
        return this.properties.reduce((largest, property) => {
            if (!largest || property.size > largest.size) {
                return property;
            }
            return largest;
        }, null);
    }

    groupByPriceRanges() {
        const priceRanges = {
            '0-500000': [],
            '500001-1000000': [],
            '1000001+': []
        };

        this.properties.forEach(property => {
            if (property.price <= 500000) {
                priceRanges['0-500000'].push(property);
            } else if (property.price <= 1000000) {
                priceRanges['500001-1000000'].push(property);
            } else {
                priceRanges['1000001+'].push(property);
            }
        });

        return priceRanges;
    }

    async fetchNewListings(newListings) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.properties = [...this.properties, ...newListings];
    }
}

const realEstateListings = new RealEstateListings([
    { location: 'Downtown', type: 'Apartment', price: 300000, size: 80 },
    { location: 'Suburbs', type: 'House', price: 750000, size: 200 },
    { location: 'City Center', type: 'Apartment', price: 450000, size: 120 },
    { location: 'Outskirts', type: 'House', price: 1200000, size: 250 },
    { location: 'Urban', type: 'Apartment', price: 200000, size: 60 },
]);

console.log(`Average price:`, realEstateListings.calculateAveragePrice());
console.log(`Apartment Properties:`, realEstateListings.filterByType('Apartment'));
console.log(`Largest property by size:`, realEstateListings.largestPropertyBySize());
console.log(`Properties grouped by price ranges:`, realEstateListings.groupByPriceRanges());

const newListings = [
    { location: 'New Area', type: 'House', price: 600000, size: 180 },
    { location: 'Modern District', type: 'Apartment', price: 900000, size: 150 },
];

realEstateListings.fetchNewListings(newListings).then(() => {
    console.log(`Updated property listings:`, realEstateListings.properties);
});
