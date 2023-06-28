import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
  public myForm:FormGroup = this.formBuilder.group({
    region: ['', [Validators.required], []],
    country: ['', [Validators.required], []],
    border: ['', [Validators.required], []]
  });

  public countriesByRegion:SmallCountry[] = [];
  public borders:SmallCountry[] = [];

  // public regions:Region[] = [];

  constructor(
    private formBuilder:FormBuilder,
    private countriesService:CountriesService
  ) {}

  ngOnInit(): void {
    // this.regions = [...this.countriesService.regions];
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions():Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged():void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        // tap(() => this.myForm.controls['country'].setValue('')),
        tap(() => this.myForm.get('country')?.setValue('')),
        tap(() => this.myForm.get('border')?.setValue('')),
        switchMap( region => this.countriesService.getCountriesByRegion(region)),
      )
      .subscribe( paises => {
        this.countriesByRegion = paises;
        this.borders = [];
      });
  }
  onCountryChanged():void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        // tap(() => this.myForm.controls['country'].setValue('')),
        tap(() => this.myForm.get('border')?.setValue('')),
        filter((value:string) => value.length > 0),
        switchMap(alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap(country => this.countriesService.getCountryBordersByCodes(country.borders))
      )
      .subscribe( countries => {
        this.borders = countries;
      });
  }

}
