import { useTranslations } from 'next-intl';
import { CategoryIcon } from '@/components/ui/icons';
import { DODOO_CATEGORIES } from '@/data/categories';

interface InterestPickerProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function InterestPicker({ selected, onToggle }: InterestPickerProps) {
  const tCat = useTranslations('categories');

  return (
    <div className="flex flex-wrap gap-1.5">
      {DODOO_CATEGORIES.map(cat => {
        const isSelected = selected.includes(cat.id);
        return (
          <button
            key={cat.id}
            onClick={() => onToggle(cat.id)}
            className="border-0 cursor-pointer py-1.5 pr-2.5 pl-1.5 rounded-full flex items-center gap-1.5 font-sans font-extrabold text-xs"
            style={{
              background: isSelected ? cat.bg : '#FFFFFF',
              color: isSelected ? cat.fg : '#9A8DBA',
              boxShadow: isSelected
                ? `inset 0 0 0 1.5px ${cat.fg}`
                : 'inset 0 0 0 1.5px #F1ECE0',
            }}
          >
            <span
              className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center shrink-0"
              style={{ background: isSelected ? cat.fg : '#F1ECE0' }}
            >
              <CategoryIcon
                name={cat.icon}
                size={11}
                color={isSelected ? cat.bg : '#9A8DBA'}
              />
            </span>
            {tCat(cat.id as Parameters<typeof tCat>[0])}
          </button>
        );
      })}
    </div>
  );
}
