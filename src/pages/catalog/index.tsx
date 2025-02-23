"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutShellProps from "@/components/layouts/shell";
import InputSelect from "@/components/InputSelect";
import SearchBar from "@/components/elements/SearchBar";
import InputRange from "@/components/InputRange";
import CheckboxGroup from "@/components/CheckboxGroup";
import Cards from "@/components/Cards";
import data from "../../data/data.json";
import PaginationGuide from "@/components/elements/PaginationGuide";
import formatCurrency from "@/utils/data/format-currency";

function Catalog() {
    const [selectedTheme, setSelectedTheme] = useState("recentes");
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState<number[]>([0, 9999]);
    const itemsPerPage = 12;

    const themeOptions = [
        { label: "Mais recentes", value: "recentes" },
        { label: "Menor preço", value: "menor" },
        { label: "Maior preço", value: "maior" },
    ];

    const router = useRouter();

    const handleNavigate = (product: object) => {
        const p = product;
        router.push(`/details?data=${encodeURIComponent(JSON.stringify(p))}`);
    };

    const filteredItems = data?.products
        ?.filter((item) => {
            const searchText = searchValue.toLowerCase();
            const matchesSearch = item.name.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText);
            const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);

            return matchesSearch && matchesPrice && matchesCategory;
        })
        ?.sort((a, b) => {
            if (selectedTheme === "menor") return a.price - b.price;
            if (selectedTheme === "maior") return b.price - a.price;
            return 0;
        });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems?.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <LayoutShellProps>
            <div className="w-full h-full justify-center items-center">
                <div className="flex gap-3 justify-center w-full">
                    <div className="flex-col w-1/3">
                        <InputSelect options={themeOptions} placeholder="Select Theme" selectedValue={selectedTheme} onValueChange={(value) => setSelectedTheme(value)} />
                        <div className="border border-gray-300 rounded-md h-64 flex-col p-6">
                            <InputRange initValue={priceRange} max={99999} step={100} label="Preço" onValueChange={(value) => setPriceRange(value)} />
                            <CheckboxGroup items={data?.categories} selectedItems={selectedCategories} onChange={setSelectedCategories} />
                        </div>
                    </div>
                    <div className="flex-col w-2/3">
                        <SearchBar placeholder="Buscar itens..." value={searchValue} onChange={(newValue) => setSearchValue(newValue)} onClear={() => setSearchValue("")} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {currentItems?.map((item) => (
                                <Cards handleClick={() => handleNavigate(item)} key={item?.id} title={formatCurrency(item?.price)} content={item?.name} image={item?.img} />
                            ))}
                        </div>
                        {totalPages > 1 && <PaginationGuide total={totalPages} value={currentPage} step={itemsPerPage} onChange={(page) => setCurrentPage(page)} />}
                    </div>
                </div>
            </div>
        </LayoutShellProps>
    );
}

export default Catalog;
