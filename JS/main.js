//useful functions
function removeDuplicateUsingSet(arr){
    let unique_array = Array.from(new Set(arr));
    return unique_array;
}

//make user repository statistics by programming language (param langs is array)
function analyzeReposByLangs(langs){
	var result = langs.reduce((acc, el) => {
		acc[el] = (acc[el] || 0) + 1;
			console.log(el+" "+acc);
			return acc;
	}, {});
	return Object.entries(result);
}











/*
HANDLING USER WORKING WITH HTML PAGE(CLICKS,...)
*/


//repositories
	$("#reposlink").click(function(){
		$("#repList").show();
		$("#userSearch").hide();
		//repository list
		var repList = new Vue({
			el:'#repList',
			data:{
				repositories:[],
				errors:[]
			},
			created(){
				axios.get('https://api.github.com/repositories').then(response => {
					this.repositories = response.data;
				}).catch(e =>{
				this.errors.push(e);
				});
			},
			methods:{
				changeMovie(e){
					$("iframe").attr('src',$(e.target).data('video-url'));
				}
			}
		});
	});
	
	
	//users
	$("#userslink").click(function(){
		//change sowing element
		$("#repList").hide();
		$("#userSearch").show();
		
		
	});
	
	//handling form input
	$("#searchuserbtn").click(function(){
		var userSearch = new Vue({
			el:'#userSearch',
			data:{
				user_info:[],
				specialities: [],
				skills: [],
				repositories2:[],
				activities:[],
				errors:[]
			},
			created(){
				//get user repositories
				var username = document.getElementById("usernamesearchid").value;
				console.log("USERNAME"+username);
				axios.get('https://api.github.com/users/'+username).then(response => {
					this.user_info = response.data;
				}).catch(e =>{
					this.errors.push(e);
				});
				axios.get('https://api.github.com/users/'+username+'/repos').then(response => {
					this.repositories2 = response.data;
					var langs = new Array();
					//get languages
					//console.log(response.data);
					this.repositories2.forEach((arrayItem) => {
						langs.push(arrayItem.language);
					});
					
					//show specialities
					this.specialities = removeDuplicateUsingSet(langs);
					
					//console.log(langs);
					//summing repositories by language
					this.activities = analyzeReposByLangs(langs);
				}).catch(e =>{
					this.errors.push(e);
				});
				
				//get skills
				var otherLangsArray = new Array();
				this.repositories2.forEach((arrayItem) => {
					axios.get(arrayItem.languages_url).then(response => {
						var objlang = response.data;
						otherLangsArray.concat(Object.keys(objlang));
						console.log(Object.keys(objlang));
					}).catch(e =>{
						this.errors.push(e);
					});
				});
				console.log(otherLangsArray);
				this.skills = removeDuplicateUsingSet(otherLangsArray);
				
				
			}
		});
	});