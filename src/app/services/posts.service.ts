import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private publication: {profileId: string, content: string} = {profileId:"", content:""};
  private postsCollection = this.store.collection('Publications');

  constructor(private store: AngularFirestore, private auth: AuthService, private usersService: UsersService) { }

  // ESSE CÓDIGO É APENAS PARA GUIA
  // NÃO COPIE, É APENAS PARA AUXILIAR NA LÓGICA
  // AINDA NÃO DECIDIMOS SE POSTS SERÃO SUBCOLLECTIONS OU COLLECTIONS

  // async listProjects() {
  //   const owner = await this.auth.getAuth().currentUser;

  //   const userCollec = this.postsCollection .doc(owner?.uid);

  //   const projectsRef = await userCollec.collection('Projects').ref;

  //   // Create a query against the collection.
  //   const query = projectsRef.where("ownerId", "==", `${owner?.uid}`).get();
  //   // console.log(query);
  //   // this.projects.push(query);
  //   return query;
  // }

  async listProject() {
    const owner = await this.auth.getAuth().currentUser;
    const publicationRef = this.postsCollection.ref;
    const query = (await publicationRef.where('profileId', '==', 'DEE634zUyvX26zTfQslX').get()).docs;
    var publicacao !: any;
    var i : number = 0;
    var teste2: any[] = [];
    query.forEach(doc=>{
      const projectRef = this.postsCollection.doc(doc.id).valueChanges().subscribe((data)=>{
      let teste: any = data as object;
      publicacao = {
        pubId : doc.id,
        profileId : teste.profileId,
        content : teste.content
      };
      teste2.push(publicacao);
      console.log(teste2);
    });
    });
  }

  async addProject(project: any) {
    const owner = await this.auth.getAuth().currentUser;
      this.usersService.getProfile(owner?.uid).subscribe(async (user : any)=>{
        this.publication = {profileId: user.profileId, content: project};
        const newPublication = await this.postsCollection.add(this.publication);
      return newPublication;
    });

  }

  async deleteProject(publication : any) {
    const owner = await this.auth.getAuth().currentUser;
      this.usersService.getProfile(owner?.uid).subscribe(async (user : any)=>{
        if (user.profileId == publication.profileId){
          const deletedPub = this.postsCollection.doc(publication.id).delete;
          return deletedPub;
      }
      else{
        const deletedPub = undefined;
        return deletedPub;
      }
    })
  }

}
