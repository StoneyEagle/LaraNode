import { Company } from './company';
import { CompanyAlternatetiveNames } from './company_alternatetive_names';
import { CompanyImages } from './company_images';

export interface CompanyDetails extends Company {
	description: string;
	headquarters: string;
	homepage: string;
	parent_company: string;
}

export interface CompanyAppend extends CompanyDetails {
	alternative_names: CompanyAlternatetiveNames;
	images: CompanyImages;
}

export type CompanyWithAppends<T extends keyof CompanyAppend> = CompanyDetails & Pick<CompanyAppend, T>;
